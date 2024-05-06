import { injectable } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { Helpers } from '~utils';

import type { IStorageFactory, NStorageFactory, IStorageStrategy } from '~types';

@injectable()
export class StorageFactory implements IStorageFactory {
  public getStorage(kind: NStorageFactory.StorageKind): IStorageStrategy {
    switch (kind) {
      case 'session':
        return container.get<IStorageStrategy>(CoreSymbols.SessionStorageStrategy);
      case 'local':
        return container.get<IStorageStrategy>(CoreSymbols.LocalStorageStrategy);
      default:
        throw Helpers.switchCaseChecker(kind);
    }
  }
}
