import type { IStorageStrategy } from '../strategies';

export interface IStorageFactory {
  getStorage(kind: NStorageFactory.StorageKind): IStorageStrategy;
}

export namespace NStorageFactory {
  export type StorageKind = 'local' | 'session';
}
