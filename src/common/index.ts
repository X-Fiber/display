import { NSchemaLoader, NStorybookLoader } from '~types';

export * from './schema-headers';
export * from './error-codes';
export * from './local-storage.keys';
export * from './auth-headers'

export const SCHEME_SERVICES: NSchemaLoader.ServiceStructure[] = [];
export const SCHEME_STORYBOOKS: NStorybookLoader.StorybookStructure[] = [];
export const CORE_EXTENSIONS: unknown[] = [];
