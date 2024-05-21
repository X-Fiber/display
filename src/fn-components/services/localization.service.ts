import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';
import { AbstractService } from './abstract.service';

import type {
  IDiscoveryService,
  ILocalizationService,
  ISchemeService,
  NLocalizationService,
} from '~types';

@injectable()
export class LocalizationService extends AbstractService implements ILocalizationService {
  protected _SERVICE_NAME = LocalizationService.name;
  private _options: NLocalizationService.Config;

  constructor(
    @inject(CoreSymbols.DiscoveryService)
    private readonly _discoveryService: IDiscoveryService,
    @inject(CoreSymbols.SchemeService)
    private readonly _schemaService: ISchemeService
  ) {
    super();

    this._options = {
      fallbackLanguage: 'en',
      defaultLanguage: 'en',
      supportedLanguages: ['en'],
    };
  }

  protected init(): boolean {
    this._options = {
      fallbackLanguage: this._discoveryService.getString(
        'services.localization.fallbackLanguage',
        this._options.fallbackLanguage
      ),
      defaultLanguage: this._discoveryService.getString(
        'services.localization.defaultLanguage',
        this._options.defaultLanguage
      ),
      supportedLanguages: this._discoveryService.getArray<string>(
        'services.localization.supportedLanguages',
        this._options.supportedLanguages
      ),
    };

    return true;
  }

  protected destroy(): void {
    void 0;
  }

  public get supportedLanguages(): string[] {
    return this._options.supportedLanguages;
  }

  public get defaultLanguage(): string {
    return this._options.defaultLanguage;
  }

  public get fallbackLanguage(): string {
    return this._options.fallbackLanguage;
  }
}
