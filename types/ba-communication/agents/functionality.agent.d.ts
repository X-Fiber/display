import type {
  IAuthProvider,
  IDiscoveryService,
  IHttpAdapter,
  INavigatorPortal,
  IStoragePortal,
  IWsAdapter,
} from '../../fn-components';

export interface IFunctionalityAgent {
  readonly auth: NFunctionalityAgent.Auth;
  readonly discovery: NFunctionalityAgent.Discovery;
  readonly event: NFunctionalityAgent.Event;
  readonly route: NFunctionalityAgent.Route;
  readonly storage: NFunctionalityAgent.Storage;
  readonly navigator: NFunctionalityAgent.Navigator;
}

export namespace NFunctionalityAgent {
  export type Discovery = {
    getMandatory: IDiscoveryService['getSchemaMandatory'];
    getString: IDiscoveryService['getSchemaString'];
    getNumber: IDiscoveryService['getSchemaNumber'];
    getBoolean: IDiscoveryService['getSchemaBoolean'];
    getArray: IDiscoveryService['getSchemaArray'];
  };

  export type Route = {
    request: IHttpAdapter['request'];
  };

  export type Storage = {
    readonly localStorage: IStoragePortal['localStorage'];
    readonly sessionStorage: IStoragePortal['sessionStorage'];
  };

  export type Event = {
    once: IWsAdapter['once'];
    subscribe: IWsAdapter['subscribe'];
    publish: IWsAdapter['publish'];
  };

  export type Navigator = {
    readonly cookieEnabled: INavigatorPortal['cookieEnabled'];
    readonly isOnline: INavigatorPortal['isOnline'];
    readonly userAgent: INavigatorPortal['userAgent'];
    readonly networkInfo: INavigatorPortal['networkInfo'];
    readonly defaultLanguage: INavigatorPortal['defaultLanguage'];
    readonly supportedLanguages: INavigatorPortal['supportedLanguages'];

    readonly useCoordinates: INavigatorPortal['useCoordinates'];
  };

  export type Auth = {
    readonly getTokenPayload: IAuthProvider['getTokenPayload'];
    readonly setTokens: IAuthProvider['setTokens'];
  };
}
