import type { IAbstractService } from './abstract.service';
import { ExtendedRecordObject, KeyStringLiteralBuilder } from '../../utils';
import { NDiscoveryService } from './discovery.service';

export interface ILocalizationService extends IAbstractService {
  readonly supportedLanguages: string[];
  readonly defaultLanguage: string;
  readonly fallbackLanguage: string;

  getDictionary<
    S extends string = string,
    DOM extends string = string,
    L extends string = string,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
  >(
    service: S,
    domain: DOM,
    language: L
  ): DICT;
  getDefaultLnResource<
    S extends string = string,
    DOM extends string = string,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
    SUB extends Record<string, string> = Record<string, string>,
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUB
  ): string;
  getResource<
    S extends string = string,
    DOM extends string = string,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
    SUB extends Record<string, string> = Record<string, string>,
    L extends string = string,
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUB,
    language?: L
  ): string;
}

export namespace NLocalizationService {
  export type Config = Pick<NDiscoveryService.EnvsConfig['services']['localization'], 'supportedLanguages' | 'defaultLanguage' | 'fallbackLanguage'>
}
