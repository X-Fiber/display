import { injectable } from '~packages';
import { AbstractStorageStrategy } from './abstract.storage.strategy';

import type { IStorageStrategy } from '~types';

@injectable()
export class SessionStorageStrategy extends AbstractStorageStrategy implements IStorageStrategy {
  protected readonly storage = sessionStorage;
  constructor() {
    super();
  }
}
