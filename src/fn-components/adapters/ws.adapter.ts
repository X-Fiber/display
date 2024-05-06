import { injectable, inject, events } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { ErrorCode } from '~common';
import { Guards } from '~utils';

import { AbstractAdapter } from './abstract.adapter';

import type {
  AnyFunction,
  IStorageProvider,
  ISchemaAgent,
  IFunctionalityAgent,
  IWsAdapter,
  NWsAdapter,
  ISchemeService,
  NSchemaService,
  NSessionService, IStoreService, NAbstractAdapter, IDiscoveryService, HttpMethod,
} from '~types';

@injectable()
export class WsAdapter extends AbstractAdapter<'ws'> implements IWsAdapter {
  protected _config: NAbstractAdapter.WsConfig

  private readonly _emitter = new events.EventEmitter();
  private _CONNECTION: WebSocket | undefined;

  constructor(
    @inject(CoreSymbols.DiscoveryService)
    protected readonly _discoveryService: IDiscoveryService,
    @inject(CoreSymbols.SchemeService)
    private readonly _schemaService: ISchemeService,
    @inject(CoreSymbols.StoreService)
    private readonly _storeService: IStoreService,
  ) {
    super()


    this._config = {
      enable: false,
      connect: {
        host: '0.0.0.0',
        protocol: 'ws',
        port: 11001,
      },
      refresh: {
        url: 'v1/update-token',
        method: 'PATCH'
      },
      http: {
        protocol: 'http',
        host: '0.0.0.0',
        port: 11000
      }
    }
  }

  private _setConfig(): NAbstractAdapter.WsConfig {
    return {
      enable: this._discoveryService.getBoolean('adapters.http.enable', this._config.enable),
      connect: {
        protocol: this._discoveryService.getString('adapters.ws.connect.protocol', this._config.connect.protocol) as 'ws' | 'wss',
        host: this._discoveryService.getString('adapters.ws.connect.host', this._config.connect.host),
        port: this._discoveryService.getNumber('adapters.ws.connect.port', this._config.connect.port),
      },
      refresh: {
        url: this._discoveryService.getString(
          'adapters.http.urls.api',
          this._config.refresh.url
        ),
        method: this._discoveryService.getString(
          'adapters.http.urls.api',
          this._config.refresh.method
        ) as HttpMethod,
      },
      http: {
        protocol: this._discoveryService.getString('adapters.http.connect.protocol', this._config.connect.protocol),
        host: this._discoveryService.getString('adapters.http.connect.host', this._config.connect.host),
        port: this._discoveryService.getNumber('adapters.http.connect.port', this._config.connect.port),
      }
    }
  }

  public init(): boolean {
    if (!this._config.enable) return false;
    this._config = this._setConfig()

    const { protocol, port, host } = this._config.connect;

    if (protocol !== 'ws' && protocol !== 'wss') {
      throw new Error(`Websocket protocol must be "ws" or "wss" but define - "${protocol}"`);
    }

    try {
      this._CONNECTION = new WebSocket(`${protocol}://${host}:${port}`);
      this._CONNECTION.addEventListener('message', async (event) => this._listen(event));

      if (window) {
        window.addEventListener('beforeunload', () => {
          const { localStorage } = container.get<IStorageProvider>(CoreSymbols.StorageProvider);

          const connectionId = localStorage.getString('websocket-connection-id', '');
          if (connectionId && connectionId.length > 0) {
            this._send('upload:page', { connectionId });
            localStorage.removeItem('websocket-connection-id');
          }
        });
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public destroy(): void {
    if (this._CONNECTION) {
      this._CONNECTION.close();
      this._CONNECTION = undefined;
    }
  }

  public get connection() {
    if (!this._CONNECTION) {
      throw new Error(`Websocket connection is undefined.`);
    }

    return this._CONNECTION;
  }

  private async _listen(event: MessageEvent): Promise<void> {
    let data: object | null;
    try {
      data = JSON.parse(event.data);
    } catch {
      data = null;
    }

    if (!data) {
      this._send('handshake.error', {
        code: ErrorCode.handshake.INVALID_STRINGIFY_OBJECT,
        message: 'WebSocket data must me stringify object',
      });

      return;
    }

    if (Guards.isEventStructure(data)) {
      if (Guards.isCorrectEvent(data.type)) {

        // TODO: implement auth interceptor

        const sStorage = this._schemaService.services.get(data.service);
        if (!sStorage) {
          this.connection.send(
            JSON.stringify({
              event: 'validation:service:not_found',
              payload: {
                code: '0001.0001',
                message: `Service "${data.service}" not found in business scheme collection.`,
              },
            })
          );
          return;
        }

        const dStorage = sStorage.get(data.domain);
        if (!dStorage) {
          this.connection.send(
            JSON.stringify({
              event: 'validation:domain:not_found',
              payload: {
                code: '0001.0002',
                message: `Domain "${data.domain}" not found in service "${data.service}".`,
              },
            })
          );
          return;
        }

        const name = this._getEventName(data.type, data.version, data.event);
        const eStorage = dStorage.emitter.get(name);
        if (!eStorage) {
          this.connection.send(
            JSON.stringify({
              event: 'validation:event:not_found',
              payload: {
                code: '0001.0003',
                message: `Event name "${data.event}" with version "${data.version}" and type "${data.type}" not found in domain "${data.domain}" in service "${data.service}".`,
              },
            })
          );
          return;
        }

        const context: NSchemaService.Context = {
          store: this._storeService.rootStore,
          user: {},
        };

        switch (eStorage.scope) {
          case 'public:route':
            break;
          case 'private:route':
            break;
        }

        const agents: NSchemaService.Agents = {
          fnAgent: container.get<IFunctionalityAgent>(CoreSymbols.FunctionalityAgent),
          schemaAgent: container.get<ISchemaAgent>(CoreSymbols.SchemaAgent),
        };

        const result = await eStorage.handler(data.payload, agents, context);
        if (result) {
          this._emitter.emit(name, result);
        } else {
          this._emitter.emit(name);
        }
      } else {
        // TODO: resolve Guards.isCorrectEvent(data.type) false case
      }
    } else {
      // TODO: resolve Guards.isEventStructure(data) false case
    }
  }

  public once<E extends string = string>(
    type: NWsAdapter.EventType,
    version: string,
    event: E,
    listener: AnyFunction
  ): void {
    const name = this._getEventName(type, version, event);
    this._emitter.once(name, listener);
  }

  public subscribe<E extends string = string>(
    type: NWsAdapter.EventType,
    version: string,
    event: E,
    listener: AnyFunction
  ): void {
    const name = this._getEventName(type, version, event);
    this._emitter.on(name, listener);
  }

  public publish(event: NSchemaService.ServerEvent): void {
    this.connection.send(
      JSON.stringify({
        event: event.type,
        payload: {
          service: event.service,
          domain: event.domain,
          event: event.event,
          scope: event.scope,
          version: event.version,
          payload: event.payload,
        },
      })
    );
  }

  private _getEventName(type: string, version: string, event: string) {
    return `${type}:${version}:${event}`;
  }

  private _send<E extends NSessionService.ClientEvent>(
    event: E,
    payload: NSessionService.EventPayload<E>
  ): void {
    this.connection.send(JSON.stringify({ event, payload }));
  }
}
