import { KeyStringLiteralBuilder } from '../../utils';

export interface IStorageStrategy {
  readonly length: number;

  setItem<T>(key: KeyStringLiteralBuilder<NStorageStrategy.StorageKeys, T>, value: unknown): void;
  getMandatory<T>(name: KeyStringLiteralBuilder<NStorageStrategy.StorageKeys, T>): T | string;
  getString(
    key: KeyStringLiteralBuilder<NStorageStrategy.StorageKeys, string>,
    def: string
  ): string;
  getNumber(
    key: KeyStringLiteralBuilder<NStorageStrategy.StorageKeys, number>,
    def: number
  ): number;
  getBoolean(
    name: KeyStringLiteralBuilder<NStorageStrategy.StorageKeys, boolean>,
    def: boolean
  ): boolean;
  getObject<T>(name: string, def: T): T;
  getArray<T>(name: string, def: Array<T>): Array<T>;
  removeItem(key: KeyStringLiteralBuilder<NStorageStrategy.StorageKeys, string>): void;
  clear(): void;
}

export namespace NStorageStrategy {
  export type StorageKeys = {
    'websocket-connection-id': string;
    'websocket-auth-connection-id': string;
    'session-id': string;
    'x-user-access-token': string;
    'x-user-refresh-token': string;
    'x-organization-access-token': string;
    'x-organization-refresh-token': string;
  };
}
