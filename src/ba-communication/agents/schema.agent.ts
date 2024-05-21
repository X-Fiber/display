import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';

import type {
  Str,
  StringObject,
  NestedObject,
  KeyStringLiteralBuilder,
  ISchemaAgent,
  IStoreService,
  ISchemeService,
  NSchemaService,
} from '~types';

@injectable()
export class SchemaAgent implements ISchemaAgent {
  constructor(
    @inject(CoreSymbols.SchemeService)
    private readonly _schemaService: ISchemeService,
    @inject(CoreSymbols.StoreService)
    private readonly _storeService: IStoreService
  ) {}

  public get services(): NSchemaService.BusinessScheme {
    return this._schemaService.services;
  }

  public getController = <T, S extends string = string, D extends string = string>(
    service: S,
    domain: D
  ): T => {
    return this._schemaService.getController<T>(service, domain);
  };

  public getStore = <T, S extends string = string, D extends string = string>(
    service: S,
    domain: D
  ): T => {
    return this._storeService.getStore<T>(service, domain);
  };

  public getDictionary = <
    DICT extends NestedObject = NestedObject,
    S extends string = string,
    DOM extends string = string,
    L extends string = string
  >(
    service: S,
    domain: DOM,
    language?: L
  ): DICT => {
    return this._schemaService.getDictionary<DICT>(
      service,
      domain,
      language ?? this._storeService.rootStore.i18n.defaultLanguage
    );
  };

  public getResource = <
    DICT extends NestedObject = NestedObject,
    S extends Str = Str,
    DOM extends Str = Str,
    SUBS extends StringObject = StringObject,
    L extends Str = Str
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUBS,
    language?: L
  ): string => {
    return this._schemaService.getResource<DICT>(
      service,
      domain,
      resource,
      language ?? this._storeService.rootStore.i18n.defaultLanguage,
      substitutions
    );
  };

  public getValidator = <T extends Record<string, unknown>>(
    service: string,
    domain: string
  ): NSchemaService.ValidateObject<T> => {
    return this._schemaService.getValidator<T>(service, domain);
  };
}
