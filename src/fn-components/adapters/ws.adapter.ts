import { injectable, inject, EventEmitter } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { ErrorCodes } from '~common';
import { Guards } from '~utils';

import { AbstractAdapter } from './abstract.adapter';

import type {
  HttpMethod,
  AnyFunction,
  ISchemaAgent,
  IFunctionalityAgent,
  IWsAdapter,
  NWsAdapter,
  ISchemeService,
  NSchemaService,
  IStoreService,
  NAbstractAdapter,
  IDiscoveryService,
} from '~types';

@injectable()
export class WsAdapter extends AbstractAdapter<'ws'> implements IWsAdapter {
  protected _config: NAbstractAdapter.WsConfig;
  protected _emitter = new EventEmitter();
  private _messageQueue: Array<string> = [];

  private _CONNECTION: WebSocket | undefined;

  constructor(
    @inject(CoreSymbols.DiscoveryService)
    protected readonly _discoveryService: IDiscoveryService,
    @inject(CoreSymbols.SchemeService)
    private readonly _schemaService: ISchemeService,
    @inject(CoreSymbols.StoreService)
    private readonly _storeService: IStoreService
  ) {
    super();

    this._config = {
      enable: false,
      connect: {
        host: '0.0.0.0',
        protocol: 'ws',
        port: 11001,
      },
      refresh: {
        url: 'v1/update-token',
        method: 'PATCH',
      },
      http: {
        protocol: 'http',
        host: '0.0.0.0',
        port: 11000,
      },
    };
  }

  private _setConfig(): NAbstractAdapter.WsConfig {
    return {
      enable: this._discoveryService.getBoolean('adapters.ws.enable', this._config.enable),
      connect: {
        protocol: this._discoveryService.getString(
          'adapters.ws.connect.protocol',
          this._config.connect.protocol
        ) as 'ws' | 'wss',
        host: this._discoveryService.getString(
          'adapters.ws.connect.host',
          this._config.connect.host
        ),
        port: this._discoveryService.getNumber(
          'adapters.ws.connect.port',
          this._config.connect.port
        ),
      },
      refresh: {
        url: this._discoveryService.getString('adapters.http.urls.api', this._config.refresh.url),
        method: this._discoveryService.getString(
          'adapters.http.urls.api',
          this._config.refresh.method
        ) as HttpMethod,
      },
      http: {
        protocol: this._discoveryService.getString(
          'adapters.http.connect.protocol',
          this._config.connect.protocol
        ),
        host: this._discoveryService.getString(
          'adapters.http.connect.host',
          this._config.connect.host
        ),
        port: this._discoveryService.getNumber(
          'adapters.http.connect.port',
          this._config.connect.port
        ),
      },
    };
  }

  public init(): boolean {
    this._config = this._setConfig();

    if (!this._config.enable) return false;

    const { protocol, port, host } = this._config.connect;

    if (protocol !== 'ws' && protocol !== 'wss') {
      throw new Error(
        JSON.stringify({
          code: ErrorCodes.fn.WsAdapter.INVALID_PROTOCOL,
          message: `Websocket protocol must be 'ws' or 'wss' but define - '${protocol}'`,
        })
      );
    }

    try {
      if (typeof window !== 'undefined') {
        this._CONNECTION = new WebSocket(`${protocol}://${host}:${port}`);
        this._CONNECTION.onopen = (ev) => {
          if (this._CONNECTION?.readyState === WebSocket.OPEN) {
            while (this._messageQueue.length > 0) {
              this._CONNECTION.send(this._messageQueue.shift() as string);
            }
          }
        };

        this._CONNECTION.addEventListener('message', async (event) => this._message(event));
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

  private async _message(event: MessageEvent): Promise<void> {
    let data: unknown;

    try {
      data = JSON.parse(event.data);
    } catch {
      this._send('handshake.error', 'validation', {
        code: ErrorCodes.fn.WsAdapter.INVALID_STRUCTURE,
        message: 'WebSocket data must me stringify object',
      });
      return;
    }

    if (!Guards.isEventStructure(data)) {
      this._send('validation.error.invalid_data_structure', 'validation', {
        code: ErrorCodes.fn.WsAdapter.INVALID_STRUCTURE,
        message: `Invalid data structure. Structure must be object and contain event type with payload information.`,
      });
      return;
    }

    if (!Guards.isCorrectEvent(data.event)) {
      this._send('validation.error.unknown_event', 'validation', {
        code: ErrorCodes.fn.WsAdapter.INVALID_EVENT_TYPE,
        message: `Event type '${data.event}' unsupported`,
      });
      return;
    }

    switch (data.kind) {
      case 'handshake':
        this._callHandshake(data.payload);
        break;
      case 'validation':
        this._callValidate(data.payload);
        break;
      case 'communication':
        await this._callSchemaHandler(data.event, data.payload);
        break;
      default:
        this._send('validation.error.unknown_event_kind', 'validation', {
          code: ErrorCodes.fn.WsAdapter.INVALID_EVENT_TYPE,
          message: `Event kind '${data.kind}' not supported.`,
        });
    }
  }

  private _callHandshake(payload: NWsAdapter.ServerHandshakePayload) {
    this._publish('handshake', payload);
  }

  private _callValidate(payload: NWsAdapter.ServerHandshakePayload) {
    this._publish('validation', payload);
  }

  private async _callSchemaHandler(
    event: NWsAdapter.AllEventType,
    payload: NWsAdapter.ServerEventPayload
  ): Promise<void> {
    const sStorage = this._schemaService.services.get(payload.service);
    if (!sStorage) {
      this._send('validation.error.service_not_found', 'validation', {
        code: ErrorCodes.fn.WsAdapter.SERVICE_NOT_FOUND,
        message: `Service "${payload.service}" not found in business scheme collection.`,
      });
      return;
    }

    const dStorage = sStorage.get(payload.domain);
    if (!dStorage) {
      this._send('validation.error.domain_not_found', 'validation', {
        code: ErrorCodes.fn.WsAdapter.DOMAIN_NOT_FOUND,
        message: `Domain "${payload.domain}" not found in service "${payload.service}".`,
      });
      return;
    }

    const name = this._getEventName(event, payload.version, payload.event);
    const eStorage = dStorage.emitter.get(name);
    if (!eStorage) {
      this._send('validation.error.event_not_found', 'validation', {
        code: ErrorCodes.fn.WsAdapter.EVENT_NOT_FOUND,
        message: `Event name "${payload.event}" with version "${payload.version}" and type "${event}" not found in domain "${payload.domain}" in service "${payload.service}".`,
      });
      return;
    }

    const context: NSchemaService.Context = {
      store: this._storeService.rootStore,
      user: {},
    };

    // TODO: implement scope
    switch (eStorage.scope) {
      case 'public':
        break;
      case 'private':
        break;
    }

    const agents: NSchemaService.Agents = {
      fnAgent: container.get<IFunctionalityAgent>(CoreSymbols.FunctionalityAgent),
      schemaAgent: container.get<ISchemaAgent>(CoreSymbols.SchemaAgent),
    };

    try {
      const result = await eStorage.handler(agents, context, payload.data);
      result ? this._emitter.emit(name, result) : this._emitter.emit(name);
    } catch (e) {
      throw new Error(
        JSON.stringify({
          code: ErrorCodes.fn.WsAdapter.CATCH_ERROR,
          message: e,
        })
      );
    } finally {
      this._publish('communication');
    }
  }

  public subscribe(event: NWsAdapter.EmitterEvent, listener: (...args: any) => void): void {
    this._emitter.on(event, listener);
  }

  public unsubscribe(event: NWsAdapter.EmitterEvent, listener?: (...args: any) => void): void {
    this._emitter.off(event, listener);
  }

  public once<E extends string = string>(
    type: NWsAdapter.PublicEventType,
    version: string,
    event: E,
    listener: AnyFunction
  ): void {
    this._emitter.once(this._getEventName(type, version, event), listener);
  }

  public on<E extends string = string>(
    type: NWsAdapter.PublicEventType,
    version: string,
    event: E,
    listener: AnyFunction
  ): void {
    this._emitter.on(this._getEventName(type, version, event), listener);
  }

  private _publish(event: NWsAdapter.EmitterEvent, payload?: any): void {
    this._emitter.emit(event, payload);
  }

  public sendToSession<T = any>(payload: NWsAdapter.SessionToSessionPayload<T>): void {
    this._publicSend<'session:to:session', T>('session:to:session', payload);
  }

  public sendToRoom<T = any>(payload: NWsAdapter.SessionToRoomPayload<T>): void {
    this._publicSend<'session:to:room', T>('session:to:room', payload);
  }

  public sendToService<T = any>(payload: NWsAdapter.SessionToServicePayload<T>): void {
    this._publicSend<'session:to:service', T>('session:to:service', payload);
  }

  private _publicSend<E extends NWsAdapter.PublicEventType, P = any>(
    event: E,
    payload: NWsAdapter.EventPayload<E, P>
  ): void {
    const message = JSON.stringify({ event, kind: 'communication', payload });
    if (this._CONNECTION?.readyState === WebSocket.OPEN) {
      this._CONNECTION?.send(message);
    } else {
      this._messageQueue.push(message);
    }
  }

  private _send<E extends NWsAdapter.AllEventType, P = any>(
    event: E,
    kind: NWsAdapter.EventKind,
    payload: NWsAdapter.AllEventPayload<E, P>
  ): void {
    const message = JSON.stringify({ event, kind, payload });
    if (this._CONNECTION?.readyState === WebSocket.OPEN) {
      this._CONNECTION?.send(message);
    } else {
      this._messageQueue.push(message);
    }
  }

  private _getEventName(type: string, version: string, event: string): string {
    return `${type}:${version}:${event}`;
  }
}
