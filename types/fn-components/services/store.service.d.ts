import { IAbstractService } from './abstract.service';
import { Zustand } from '../../packages';

export interface IStoreService extends IAbstractService {
  readonly rootStore: NStoreService.RootStore;

  createStore<T>(service: string, domain: string): void;
  getStore<T>(
    service: string,
    domain: string
  ): Zustand.StateCreator<T> | Zustand.PersistStateCreator<T>;
}

export namespace NStoreService {
  export type StorageKind = 'localStorage' | 'sessionStorage';
  export type MemoryKind = 'persist' | 'vanish';

  export type i18nConfig = {
    defaultLanguage: string;
    fallbackLanguage: string;
    supportedLanguages: string[];
  };
  export type Config = {
    i18n: i18nConfig;
  };

  export type RootStore = {
    i18n: i18nConfig;
  };

  export type Store<T = any> = Zustand.StateCreator<T> | Zustand.PersistStateCreator<T>;
  export type Stores<T = any> = Map<
    string,
    Zustand.StateCreator<T> | Zustand.PersistStateCreator<T>
  >;

  // new
}
