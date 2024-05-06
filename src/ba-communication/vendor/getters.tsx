import { ReactElement } from 'react';
import { container } from '~container';
import { CoreSymbols } from '~symbols';

import type {
  IFunctionalityAgent,
  ISchemaAgent,
  ISchemeService,
  IStoreService,
  IStorybookLoader,
  NSchemaAgent,
  NSchemaService,
} from '~types';

export type ComponentProps<
  S extends string = string,
  D extends string = string,
  N extends string = string,
  P = any,
> = {
  storybook: S;
  space: D;
  name: N;
  props?: P;
};

export const Component = <
  S extends string = string,
  D extends string = string,
  N extends string = string,
  P = any,
>(
  cProps: ComponentProps<S, D, N, P>
): ReactElement => {
  const { storybook, space, name } = cProps;


  const services = container.get<IStorybookLoader>(CoreSymbols.StorybookLoader).storybooks;

  console.log('@services', services);

  const dSpace = services.get(storybook);
  if (!dSpace) {
    throw new Error(`Storybook "${storybook}" not found.`);
  }

  const vStorage = dSpace.get(space);
  if (!vStorage) {
    throw new Error(`Space storage "${space}" not found in storybook "${storybook}".`);
  }

  const component = vStorage.get(name);

  if (!component) {
    throw new Error(
      `UI components not found in space storage "${space}" in storybook "${storybook}". `
    );
  }

  return cProps.props ? component(cProps.props) : component();
};

export type ViewProps<
  S extends string = string,
  D extends string = string,
  V extends string = string,
  P = never,
> = {
  service: S;
  domain: D;
  view: V;
  props?: P;
};

export const View = <
  S extends string = string,
  D extends string = string,
  V extends string = string,
  P = never,
>(
  viewProps: ViewProps<S, D, V, P>
): ReactElement => {
  const { service, domain, props, view } = viewProps;

  const services = container.get<ISchemeService>(CoreSymbols.SchemeService).services;

  const dStorage = services.get(service);
  if (!dStorage) {
    throw new Error(`Service "${service}" not found.`);
  }

  const vStorage = dStorage.get(domain);
  if (!vStorage) {
    throw new Error(`Domain storage "${domain}" not found in service "${service}".`);
  }

  const el = vStorage.views.get(view);

  if (!el) {
    throw new Error(
      `View function not found in domain storage "${domain}" in service "${service}". `
    );
  }

  const agents: NSchemaService.Agents = {
    fnAgent: container.get<IFunctionalityAgent>(CoreSymbols.FunctionalityAgent),
    schemaAgent: container.get<ISchemaAgent>(CoreSymbols.SchemaAgent),
  };

  const rootStore = container.get<IStoreService>(CoreSymbols.StoreService).rootStore;
  const context: NSchemaAgent.ViewContext = {
    rootStore: rootStore,
  };

  return props ? el(agents, context, props) : el(agents, context);
};
