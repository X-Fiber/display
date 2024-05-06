import type {
  AnyFunction,
  AnyObject,
  NSchemaLoader,
  NSchemaService,
  NStorybookLoader,
} from '~types';

export const setController = <S extends Record<string, unknown>>(
  structure: NSchemaLoader.ControllerStructure<S>
): NSchemaLoader.ControllerStructure<S> => {
  return structure;
};

export const setSubscriber = <S extends Record<string, unknown>>(
  structure: NSchemaLoader.SubscriberStructure<S>
): NSchemaLoader.SubscriberStructure<S> => {
  return structure;
};

export const setDictionary = <L extends string, D extends NSchemaService.Dictionary>(
  language: L,
  dictionary: D
): NSchemaLoader.DictionaryStructure<L, D> => {
  return { language, dictionary };
};

export const setStore = <B = AnyObject, A = AnyObject>(
  store: NSchemaLoader.StoreStructure<B, A>
): NSchemaLoader.StoreStructure<B, A> => {
  return store;
};

export const setView = <N extends string, A extends NSchemaService.AuthScope, P = unknown>(
  name: N,
  view: NSchemaService.ViewHandler<A, P>
): NSchemaLoader.ViewStructure<N, A, P> => {
  return { name, view };
};

export const setValidator = <S extends Record<string, unknown>>(
  structure: NSchemaLoader.ValidatorStructure<S>
): NSchemaLoader.ValidatorStructure<S> => {
  return structure;
};

export const setHelper = <S extends Record<string, AnyFunction>>(
  structure: NSchemaLoader.HelperStructure<S>
): NSchemaLoader.HelperStructure<S> => {
  return structure;
};

export const setPointer = <N extends string>(
  name: N,
  documents: NSchemaLoader.DocumentsStructure
): NSchemaLoader.DomainStructure => {
  return { name, documents };
};

export const setService = <S extends string>(
  name: S,
  domains: NSchemaLoader.DomainStructure[]
): NSchemaLoader.ServiceStructure => {
  return { name, domains };
};

export const setServices = (
  services: NStorybookLoader.StorybookStructure | NStorybookLoader.StorybookStructure[]
): NStorybookLoader.StorybookStructure[] => {
  return Array.isArray(services) ? services : [services];
};
