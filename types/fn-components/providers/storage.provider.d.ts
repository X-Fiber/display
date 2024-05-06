import type { IStorageStrategy } from '../strategies';

export interface IStorageProvider {
  readonly localStorage: IStorageStrategy;
  readonly sessionStorage: IStorageStrategy;
}
