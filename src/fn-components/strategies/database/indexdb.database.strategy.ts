import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';

import type { IDatabaseStrategy, IDiscoveryService, NDatabaseStrategy } from '~types';

@injectable()
export class IndexDBDatabaseStrategy implements IDatabaseStrategy {
  private _config: NDatabaseStrategy.Config;
  private _DB_REQUEST: IDBOpenDBRequest | undefined;

  constructor(
    @inject(CoreSymbols.DiscoveryService)
    private readonly _discoveryService: IDiscoveryService
  ) {
    this._config = {
      enable: false,
      name: 'services',
      defaultVersion: 1,
    };
  }

  private _setConfig(): NDatabaseStrategy.Config {
    return {
      enable: this._discoveryService.getBoolean('strategies.database.enable', this._config.enable),
      defaultVersion: this._discoveryService.getNumber(
        'strategies.database.defaultVersion',
        this._config.defaultVersion
      ),
      name: this._discoveryService.getString('strategies.database.name', this._config.name),
    };
  }

  private get _indexDb(): IDBFactory {
    return indexedDB;
  }

  public init(): void {
    this._config = this._setConfig();

    this._DB_REQUEST = this._indexDb.open(this._config.name, this._config.defaultVersion);
  }
}
