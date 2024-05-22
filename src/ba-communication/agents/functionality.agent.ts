import { injectable, inject } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';

import type {
  AnyObject,
  IWsAdapter,
  IHttpAdapter,
  NHttpAdapter,
  IAuthProvider,
  IStoragePortal,
  INavigatorPortal,
  IDiscoveryService,
  NDiscoveryService,
  IFunctionalityAgent,
  NFunctionalityAgent,
} from '~types';

@injectable()
export class FunctionalityAgent implements IFunctionalityAgent {
  constructor(
    @inject(CoreSymbols.DiscoveryService)
    private readonly _discoveryService: IDiscoveryService,
    @inject(CoreSymbols.HttpAdapter)
    private readonly _httpAdapter: IHttpAdapter,
    @inject(CoreSymbols.WsAdapter)
    private readonly _wsAdapter: IWsAdapter,
    @inject(CoreSymbols.AuthProvider)
    private readonly _authService: IAuthProvider
  ) {}

  public get discovery(): NFunctionalityAgent.Discovery {
    return {
      getMandatory: <T extends string | number | boolean, C extends AnyObject>(
        name: NDiscoveryService.KeyBuilder<C, T>
      ) => {
        return this._discoveryService.getSchemaMandatory<T, C>(name);
      },
      getString: <C extends AnyObject>(
        name: NDiscoveryService.KeyBuilder<C, string>,
        def: string
      ): string => {
        return this._discoveryService.getSchemaString<C>(name, def);
      },
      getNumber: <C extends AnyObject>(
        name: NDiscoveryService.KeyBuilder<C, number>,
        def: number
      ): number => {
        return this._discoveryService.getSchemaNumber<C>(name, def);
      },
      getBoolean: <C extends AnyObject>(
        name: NDiscoveryService.KeyBuilder<C, boolean>,
        def: boolean
      ): boolean => {
        return this._discoveryService.getSchemaBoolean<C>(name, def);
      },
      getArray: <T extends string | number | boolean, C extends AnyObject>(
        name: NDiscoveryService.KeyBuilder<C, Array<T>>,
        def: Array<T>
      ): Array<T> => {
        return this._discoveryService.getSchemaArray<T, C>(name, def);
      },
    };
  }

  public get ws(): NFunctionalityAgent.ws {
    return {
      on: (type, version, event, listener) => {
        return this._wsAdapter.on(type, version, event, listener);
      },
      once: (type, version, event, listener) => {
        return this._wsAdapter.once(type, version, event, listener);
      },
      sendToRoom: <T = any>(payload: NFunctionalityAgent.WsRoom<T>): void => {
        return this._wsAdapter.sendToRoom({
          data: payload.data ?? null,
          roomId: payload.roomId,
          scope: payload.scope ?? 'public',
          version: payload.version ?? 'v1',
          service: payload.service,
          event: payload.event,
          domain: payload.domain,
        });
      },
      sendToService: <T = any>(payload: NFunctionalityAgent.WsPayload<T>): void => {
        return this._wsAdapter.sendToService({
          data: payload.data ?? null,
          scope: payload.scope ?? 'public',
          version: payload.version ?? 'v1',
          service: payload.service,
          event: payload.event,
          domain: payload.domain,
        });
      },
      sendToSession: <T = any>(payload: NFunctionalityAgent.WsSession<T>): void => {
        this._wsAdapter.sendToSession({
          data: payload.data ?? null,
          sessionId: payload.sessionId,
          scope: payload.scope ?? 'public',
          version: payload.version ?? 'v1',
          service: payload.service,
          event: payload.event,
          domain: payload.domain,
        });
      },
    };
  }

  public get route(): NFunctionalityAgent.Route {
    return {
      request: <
        S extends string = string,
        D extends string = string,
        RO extends string = string,
        DA = any,
        RE = any
      >(
        service: S,
        domain: D,
        route: RO,
        config?: NHttpAdapter.RequestOptions<DA>
      ): Promise<NHttpAdapter.Response<RE>> => {
        const options: NHttpAdapter.RequestOptions<DA> = {
          scope: 'public:route',
          method: 'GET',
          version: 'v1',
          data: undefined,
          headers: undefined,
          params: undefined,
          queries: undefined,
        };

        if (config) {
          if (config.method) options.method = config.method;
          if (config.scope) options.scope = config.scope;
          if (config.version) options.version = config.version;
          if (config.data) options.data = config.data;
          if (config.headers) options.headers = config.headers;
          if (config.params) options.params = config.params;
          if (config.queries) options.queries = config.queries;
        }

        return this._httpAdapter.request<S, D, RO, DA, RE>(service, domain, route, {
          method: options.method,
          scope: options.scope,
          version: options.version,
          params: options.params,
          headers: options.headers,
          queries: options.queries,
          data: options.data,
        });
      },
    };
  }

  public get storage(): NFunctionalityAgent.Storage {
    const provider = container.get<IStoragePortal>(CoreSymbols.StoragePortal);

    return {
      localStorage: provider.localStorage,
      sessionStorage: provider.sessionStorage,
    };
  }

  public get navigator(): NFunctionalityAgent.Navigator {
    const provider = container.get<INavigatorPortal>(CoreSymbols.NavigatorPortal);

    return {
      cookieEnabled: provider.cookieEnabled,
      isOnline: provider.isOnline,
      userAgent: provider.userAgent,
      networkInfo: provider.networkInfo,
      defaultLanguage: provider.defaultLanguage,
      supportedLanguages: provider.supportedLanguages,
      useCoordinates: (successCallback, errorCallback) => {
        return provider.useCoordinates(successCallback, errorCallback);
      },
    };
  }

  public get auth(): NFunctionalityAgent.Auth {
    return {
      getTokenPayload: <P>() => {
        return this._authService.getTokenPayload<P>();
      },
      setTokens: (access: string, refresh: string) => {
        return this._authService.setTokens(access, refresh);
      },
    };
  }
}
