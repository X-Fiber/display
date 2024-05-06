import type { FC } from 'react';
import type { IStoreService, NSchemaService } from '../../fn-components';
import type { ExtendedRecordObject, KeyStringLiteralBuilder } from '../../utils';

export interface ISchemaAgent {
  readonly services: NSchemaService.BusinessScheme;

  getServiceDomains<S extends string = string>(service: S): NSchemaService.Domains;
  getDomainsDocuments<S extends string = string, D extends string = string>(
    service: S,
    domain: D
  ): NSchemaService.Documents;
  getView<
    S extends string = string,
    D extends string = string,
    V extends string = string,
    P = never,
  >(
    service: S,
    domain: D,
    view: V,
    props?: P
  ): FC<P>;
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
    SUBS extends Record<string, string> = Record<string, string>,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUBS
  ): string;
  getResource<
    S extends string = string,
    DOM extends string = string,
    L extends string = string,
    SUBS extends Record<string, string> = Record<string, string>,
    DICT extends ExtendedRecordObject = ExtendedRecordObject,
  >(
    service: S,
    domain: DOM,
    resource: KeyStringLiteralBuilder<DICT>,
    substitutions?: SUBS,
    language?: L
  ): string;
  getStore<SER extends string = string, D extends string = string, STO = any>(
    service: SER,
    domain: D
  ): () => STO;
}

export namespace NSchemaAgent {
  export type ViewContext = {
    rootStore: IStoreService['rootStore'];
  };
}
