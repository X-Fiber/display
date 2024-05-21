import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';
import { container } from '~container';

import type { FC } from 'react';
import type {
  ExtendedRecordObject,
  IFunctionalityAgent,
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
    @inject(CoreSymbols.StoreService)
    private readonly _storeService: IStoreService,
  ) {}

  public get services(): NSchemaService.BusinessScheme {
    return this._schemaService.services;
  }

  public getController = <T, S extends string = string, D extends string = string, C extends string = string>(service: S, domain:D, controller: C): T => {
    return this._schemaService.getController<T>(service, domain, controller)
  }

  public getStore = <T, S extends string = string, D extends string = string>(service: S, domain:D): T => {
    return this._storeService.getStore<T>(service, domain)
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
    throw new Error('Method not implemented')
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
    throw new Error('Method not implemented')
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
    throw new Error('Method not implemented')
  }
}
