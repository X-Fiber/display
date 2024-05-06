import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';
import { container } from '~container';

import type { FC } from 'react';
import type {
  ExtendedRecordObject,
  IAuthProvider,
  IFunctionalityAgent,
  ILocalizationService,
  ISchemaAgent,
  ISchemeService,
  IStoreService,
  KeyStringLiteralBuilder,
  NSchemaAgent,
  NSchemaService,
} from '~types';

@injectable()
export class SchemaAgent implements ISchemaAgent {
  constructor(
    @inject(CoreSymbols.SchemeService)
    private readonly _schemaService: ISchemeService,
    @inject(CoreSymbols.LocalizationService)
    private readonly _localizationService: ILocalizationService,
    @inject(CoreSymbols.StoreService)
    private readonly _storeService: IStoreService,
    @inject(CoreSymbols.AuthProvider)
    private readonly _authService: IAuthProvider
  ) {}

  public get services(): NSchemaService.BusinessScheme {
    return this._schemaService.services;
  }

  public getServiceDomains<S extends string = string>(service: S): NSchemaService.Domains {
    const sStorage = this._schemaService.services.get(service);
    if (!sStorage) {
      throw new Error(`Service "${service}" not found.`);
    }

    return sStorage;
  }

  public getDomainsDocuments<S extends string = string, D extends string = string>(
    service: S,
    domain: D
  ): NSchemaService.Documents {
    const sStorage = this.getServiceDomains(service);

    const dStorage = sStorage.get(domain);
    if (!dStorage) {
      throw new Error(`Domain "${domain}" in service "${service}" not found.`);
    }

    return dStorage;
  }

  public getView<
    S extends string = string,
    D extends string = string,
    V extends string = string,
    P = undefined,
  >(service: S, domain: D, view: V, props: P): FC<P> {
    const dStorage = this.getDomainsDocuments<S, D>(service, domain);

    const vStorage = dStorage.views.get(view);

    if (!vStorage) {
      throw new Error(`View "${view}" in domain "${domain}" in service "${service}" not found.`);
    }

    const agents: NSchemaService.Agents = {
      fnAgent: container.get<IFunctionalityAgent>(CoreSymbols.FunctionalityAgent),
      schemaAgent: container.get<ISchemaAgent>(CoreSymbols.SchemaAgent),
    };

    const content: NSchemaAgent.ViewContext = {
      rootStore: this._storeService.rootStore,
    };

    return vStorage(agents, content, props);
  }

  public getDictionary<
    S extends string = string,
    DOM extends string = string,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
    L extends string = string,
  >(service: S, domain: DOM, language: L): DICT {
    return this._localizationService.getDictionary<S, DOM, L, DICT>(service, domain, language);
  }

  public getDefaultLnResource<
    S extends string = string,
    DOM extends string = string,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
    SUBS extends Record<string, string> = Record<string, string>,
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUBS
  ): string {
    return this._localizationService.getDefaultLnResource<S, DOM, DICT, SUBS>(
      service,
      domain,
      resource,
      substitutions
    );
  }

  public getResource<
    S extends string = string,
    DOM extends string = string,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
    SUBS extends Record<string, string> = Record<string, string>,
    L extends string = string,
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUBS,
    language?: L
  ): string {
    return this._localizationService.getResource<S, DOM, DICT, SUBS, L>(
      service,
      domain,
      resource,
      substitutions,
      language
    );
  }

  public getStore<SER extends string = string, D extends string = string, STO = any>(
    service: SER,
    domain: D
  ): () => STO {
    return this._storeService.getStore<STO>(service, domain);
  }
}
