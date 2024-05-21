import type { IStoreService, NSchemaService } from '../../fn-components';
import type { KeyStringLiteralBuilder, NestedObject } from '../../utils';

export interface ISchemaAgent {
  readonly services: NSchemaService.BusinessScheme;

  getController<T, S extends string = string, D extends string = string, C extends string = string>(
    service: S,
    domain: D,
    controller: C
  ): T;
  getDictionary<
    DICT extends NestedObject = NestedObject,
    S extends string = string,
    DOM extends string = string,
    L extends string = string
  >(
    service: S,
    domain: DOM,
    language: L
  ): DICT;
  getResource<
    DICT extends NestedObject = NestedObject,
    S extends string = string,
    DOM extends string = string,
    L extends string = string,
    SUBS extends Record<string, string> = Record<string, string>
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
  getValidator<T extends Record<string, unknown>>(
    service: string,
    domain: string
  ): NSchemaService.ValidateObject<T>;
}

export namespace NSchemaAgent {
  export type ViewContext = {
    rootStore: IStoreService['rootStore'];
  };

  export type Documents = {
    controller: any;
    validator: Record<string, unknown>;
    store: any;
  };
}
