import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';
import { AbstractService } from './abstract.service';

import type { ICombinationService, IHttpAdapter, IWsAdapter } from '~types';

@injectable()
export class CombinationService extends AbstractService implements ICombinationService {
  protected _SERVICE_NAME = CombinationService.name;

  constructor(
    @inject(CoreSymbols.HttpAdapter)
    private readonly _httpAdapter: IHttpAdapter,
    @inject(CoreSymbols.WsAdapter)
    private readonly _wsAdapter: IWsAdapter
  ) {
    super();
  }

  protected init(): boolean {
    try {
      this._httpAdapter.init();
      this._wsAdapter.init();

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  protected destroy(): void {
    try {
      this._httpAdapter.destroy();
      this._wsAdapter.destroy();
    } catch (e) {
      console.log(e);
    }
  }
}
