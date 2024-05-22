import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { SCHEME_STORYBOOKS, SCHEME_SERVICES, CORE_EXTENSIONS, WEB_CLIENT_TYPE } from '~common';

import { IInitiator, ISchemeService, NSchemaLoader, NStorybookLoader } from '~types';

const initiator = container.get<IInitiator>(CoreSymbols.Initiator);

const setServices = (services: NSchemaLoader.ServiceStructure[]): void => {
  SCHEME_SERVICES.length = 0;
  SCHEME_SERVICES.push(...services);
};

const setStorybooks = (services: NStorybookLoader.StorybookStructure[]): void => {
  SCHEME_STORYBOOKS.length = 0;
  SCHEME_STORYBOOKS.push(...services);
};

const setExtensions = (extensions: string[]) => {
  CORE_EXTENSIONS.length = 0;
  CORE_EXTENSIONS.push(...extensions);
};

const setClientType = (type: 'NextJS' | 'ReactJS' | 'RemixJS') => {
  WEB_CLIENT_TYPE.type = type;
};

export * from './fn-components';
export * from './ba-communication';

export { initiator, setServices, setStorybooks, setExtensions, setClientType };
