import { injectable } from '~packages';
import { IAbstractService } from '~types';

@injectable()
export abstract class AbstractService implements IAbstractService {
  protected abstract _SERVICE_NAME: string;
  protected abstract init(): boolean;
  protected abstract destroy(): void;

  public start(): void {
    this.init();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`Service ${this._SERVICE_NAME} has been started.`);
    }
  }

  public stop(): void {
    this.destroy();
  }
}
