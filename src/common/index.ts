import { NSchemaLoader, NStorybookLoader } from '~types';

export * from './error-codes';
export * from './auth-headers';

export const SCHEME_SERVICES: NSchemaLoader.ServiceStructure[] = [];
export const SCHEME_STORYBOOKS: NStorybookLoader.StorybookStructure[] = [];
export const CORE_EXTENSIONS: unknown[] = [];
export const WEB_CLIENT_TYPE: {
  type: 'NextJS' | 'ReactJS' | 'RemixJS' | undefined;
} = {
  type: undefined,
};
