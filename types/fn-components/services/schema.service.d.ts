import { ReactElement } from 'react';

import type { Zustand, Joi } from '../../packages';
import type { AnyFunction, KeyStringLiteralBuilder, NestedObject } from '../../utils';

import type { IFunctionalityAgent, ISchemaAgent } from '../../ba-communication';
import type { IAbstractService } from './abstract.service';
import type { NStoreService } from './store.service';
import type { NWsAdapter } from '../adapters';

export interface ISchemeService extends IAbstractService {
  readonly services: NSchemaService.BusinessScheme;

  getController<T>(service: string, domain: string): T;
  getDictionary<DICT extends NestedObject = NestedObject>(
    service: string,
    domain: string,
    language: string
  ): DICT;
  getResource<DICT extends NestedObject = NestedObject>(
    service: string,
    domain: string,
    resource: KeyStringLiteralBuilder<DICT>,
    language: string,
    substitutions?: Record<string, string>
  ): string;
  getValidator<T extends Record<string, unknown>>(
    service: string,
    domain: string
  ): NSchemaService.ValidateObject<T>;
}

export namespace NSchemaService {
  export type AuthScope = 'public' | 'private';
  export type Context<A extends AuthScope = AuthScope, U = any, S = any> = A extends 'public'
    ? {
        store: any;
      }
    : A extends 'private'
    ? {
        store: any;
        user: U;
      }
    : never;

  export type Agents = {
    fnAgent: IFunctionalityAgent;
    schemaAgent: ISchemaAgent;
  };

  export type Store<S = any, T = any> = {
    actions: Zustand.Actions<S, T>;
    storage?: NStoreService.StorageKind; // default 'localStorage'
    persistence?: NStoreService.MemoryKind; // default 'persist'
    partiality?: (state: S) => S; // default undefined
    version?: number; // default 1
    skipHydration?: boolean; // default true
  };

  export type ControllerHandler = <A extends AuthScope>(
    agents: NSchemaService.Agents,
    context: Context<A>,
    data: any
  ) => any;

  export type Controller = {
    scope: AuthScope;
    handler: ControllerHandler;
  };

  export type SubscriberHandler = <A extends AuthScope = AuthScope, D = any, R = any>(
    agents: NSchemaService.Agents,
    context: Context<A>,
    payload: D
  ) => Promise<R | void>;

  export type EmitterEvent<E extends string = string> = {
    name: E;
    type: NWsAdapter.EventType;
    scope: AuthScope;
    version: NWsAdapter.Version;
    handler: SubscriberHandler;
  };

  export type ServerEvent<
    S extends string = string,
    D extends string = string,
    E extends string = string,
    P = any
  > = {
    service: S;
    domain: D;
    event: E;
    type: NWsAdapter.EventType;
    scope: AuthScope;
    version: NWsAdapter.Version;
    payload: P;
  };

  export type Dictionary = Record<string, Dictionary | string>;

  export type ViewHandler<A extends AuthScope, P = unknown> = (
    agents: NSchemaService.Agents,
    context: Context<A>,
    props: P
  ) => ReactElement<P>;

  export type Localization = {
    getResource: ISchemaAgent['getResource'];
  };

  export type ValidatorHandler<I = any> = (
    provider: Joi.Root,
    localization: Localization
  ) => Joi.ObjectSchema<I>;

  export type ValidateObject<T extends Record<string, unknown>> = {
    [key in keyof T]: () => Joi.ObjectSchema<T[key]>;
  };

  export type Documents = {
    controller: Map<string, Controller>;
    emitter: Map<string, EmitterEvent>;
    dictionaries: Map<string, Dictionary>;
    store: Store | null;
    views: Map<string, ViewHandler>;
    validator: Map<string, ValidatorHandler>;
    helper: Map<string, AnyFunction>;
  };

  export type Domains = Map<string, Documents>;
  export type BusinessScheme = Map<string, Domains>;
}
