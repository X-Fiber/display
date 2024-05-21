import type { IStorageStrategy } from '../strategies';

export interface IStoragePortal {
  readonly localStorage: IStorageStrategy;
  readonly sessionStorage: IStorageStrategy;
}
