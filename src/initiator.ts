import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';

import type {
  IDiscoveryService,
  ICombinationService,
  IInitiator,
  ILocalizationService,
  ISchemeService,
  ISessionService,
  IStoreService, IStorybookService,
} from '~types';

@injectable()
export class Initiator implements IInitiator {
  constructor(
    @inject(CoreSymbols.DiscoveryService)
    private readonly _discoveryService: IDiscoveryService,
    @inject(CoreSymbols.SchemeService)
    private readonly _schemeService: ISchemeService,
    @inject(CoreSymbols.StorybookService)
    private readonly _storybookService: IStorybookService,
    @inject(CoreSymbols.CombinationService)
    private readonly _combinationService: ICombinationService,
    @inject(CoreSymbols.LocalizationService)
    private readonly _localizationService: ILocalizationService,
    @inject(CoreSymbols.SessionService)
    private readonly _sessionService: ISessionService,
    @inject(CoreSymbols.StoreService)
    private readonly _storeService: IStoreService,
  ) {}

  public start(): void {
    this._discoveryService.start();
    this._storybookService.start()
    this._schemeService.start();
    this._combinationService.start();
    this._storeService.start();
    this._localizationService.start();
    this._sessionService.start();
  }

  public stop(): void {
    this._sessionService.stop();
    this._localizationService.stop();
    this._storeService.stop();
    this._combinationService.stop();
    this._schemeService.stop();
    this._storybookService.stop()
    this._discoveryService.stop();
  }
}
