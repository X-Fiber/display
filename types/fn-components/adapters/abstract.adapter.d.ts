import type { NDiscoveryService } from '../services';

export interface IAbstractAdapter {
  init(): boolean;
  destroy(): void;
}

export namespace NAbstractAdapter {
  export type AdapterKind = 'http' | 'ws';

  export type HttpConfig = Pick<
    NDiscoveryService.EnvsConfig['adapters']['http'],
    'enable' | 'connect' | 'urls' | 'refresh'
  >;
  export type WsConfig = Pick<
    NDiscoveryService.EnvsConfig['adapters']['ws'],
    'enable' | 'connect' | 'refresh'
  > & {
    http: NDiscoveryService.EnvsConfig['adapters']['http']['connect'];
  };

  export type Config<T extends AdapterKind> = T extends 'http'
    ? HttpConfig
    : T extends 'ws'
    ? WsConfig
    : never;
}
