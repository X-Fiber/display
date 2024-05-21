import type { IAbstractService } from './abstract.service';
import type { NDiscoveryService } from './discovery.service';

export interface ILocalizationService extends IAbstractService {
  readonly supportedLanguages: string[];
  readonly defaultLanguage: string;
  readonly fallbackLanguage: string;
}

export namespace NLocalizationService {
  export type Config = Pick<
    NDiscoveryService.EnvsConfig['services']['localization'],
    'supportedLanguages' | 'defaultLanguage' | 'fallbackLanguage'
  >;
}
