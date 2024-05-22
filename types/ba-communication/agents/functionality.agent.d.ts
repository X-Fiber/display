import {
  IAuthProvider,
  IDiscoveryService,
  IHttpAdapter,
  INavigatorPortal,
  IStoragePortal,
  IWsAdapter,
  NWsAdapter,
} from '../../fn-components';
import * as path from 'node:path';

export interface IFunctionalityAgent {
  readonly auth: NFunctionalityAgent.Auth;
  readonly discovery: NFunctionalityAgent.Discovery;
  readonly ws: NFunctionalityAgent.ws;
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

  export type ws = {
    once: IWsAdapter['once'];
    on: IWsAdapter['on'];
    sendToSession: <T = any>(payload: WsSession<T>) => void;
    sendToRoom: <T = any>(payload: WsRoom<T>) => void;
    sendToService: <T = any>(payload: WsPayload<T>) => void;
  };

  export type WsPayload<D> = {
    version?: NWsAdapter.Version;
    scope?: NWsAdapter.AuthScope;
    service: string;
    domain: string;
    event: string;
    data?: D;
  };

  export type WsSession<D = any> = WsPayload<D> & { sessionId: string };
  export type WsRoom<D = any> = WsPayload<D> & { roomId: string };

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
