import { injectable } from '~packages';

import type { IAbstractService } from '~types';

@injectable()
export abstract class AbstractService implements IAbstractService {
  protected abstract _SERVICE_NAME: string;
  protected abstract init(): boolean;
  protected abstract destroy(): void;

  public start(): void {
    this.init();

    console.log(`Service ${this._SERVICE_NAME} has been started.`);
  }

  public stop(): void {
    this.destroy();
  }
}
