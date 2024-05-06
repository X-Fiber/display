import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';

import type { IStorageFactory, IStorageProvider, IStorageStrategy } from '~types';

@injectable()
export class StorageProvider implements IStorageProvider {
  constructor(
    @inject(CoreSymbols.StorageFactory)
    private readonly _storageFactory: IStorageFactory
  ) {}

  public get localStorage(): IStorageStrategy {
    return this._storageFactory.getStorage('local');
  }
  public get sessionStorage(): IStorageStrategy {
    return this._storageFactory.getStorage('session');
  }
}
