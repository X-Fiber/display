import type { AnyFunction, AnyObject, ExtendedRecordObject } from '../../utils';
import type { NSchemaService } from '../../fn-components';

export interface ISchemaLoader {
  readonly services: NSchemaService.BusinessScheme;

  init(): void;
  destroy(): void;
  setBusinessLogic(services: NSchemaLoader.ServiceStructure[]): void;
}

export namespace NSchemaLoader {
  export type ControllerStructure<S extends string> = {
    [key in S]: NSchemaService.Controller
  }

  export type SubscriberStructure<N extends Record<string, unknown>> = {
    [K in keyof N]: N[K] extends infer I ? NSchemaService.SubscriberHandler<I> : never
  };

  export type StoreStructure<B = any, A = any> = NSchemaService.Store<B, A>;

  export type ViewStructure<N extends string, A extends NSchemaService.AuthScope, P = unknown> = {
    name: N;
    view: NSchemaService.ViewHandler<A, P>;
  };

  export type EmitterStructure<E extends string = string> = {
    [key in E]: NSchemaService.EmitterEvent;
  };

  export type ValidatorStructure<T extends Record<string, unknown> = Record<string, unknown>> = {
    [K in keyof T]: T[K] extends infer I ? NSchemaService.ValidatorHandler<I> : T[K];
  };

  export type HelperStructure<N extends Record<string, AnyFunction>> = {
    [key in keyof N]: AnyFunction;
  };

  export type DictionaryStructure<L extends string, D extends ExtendedRecordObject> = {
    language: L;
    dictionary: D;
  };

  export type DocumentsStructure = {
    controller?: ControllerStructure;
    emitter?: EmitterStructure;
    store?: StoreStructure;
    views?: ViewStructure | ViewStructure[];
    validator?: ValidatorStructure;
    helper?: HelperStructure;
    dictionary?: DictionaryStructure | DictionaryStructure[];
  };

  export type DomainStructure = {
    name: string;
    documents: DocumentsStructure;
  };

  export type ServiceStructure = {
    name: string;
    domains: DomainStructure[];
  };
}
