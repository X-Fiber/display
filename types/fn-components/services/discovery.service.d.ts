import type { IAbstractService } from './abstract.service';
import type { AnyObject, HttpMethod } from '../../utils';

export interface IDiscoveryService extends IAbstractService {
  readonly nodeEnv: string;

  getMandatory<T extends string | number | boolean>(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, T>
  ): T;
  getString(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, string>,
    def: string
  ): string;
  getNumber(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, number>,
    def: number
  ): number;
  getBoolean(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, boolean>,
    def: boolean
  ): boolean;
  getArray<T extends string | number | boolean>(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, Array<T>>,
    def: Array<T>
  ): Array<T>;

  getSchemaMandatory<T extends string | number | boolean, C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, T>
  ): T;
  getSchemaString<C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, string>,
    def: string
  ): string;
  getSchemaNumber<C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, number>,
    def: number
  ): number;
  getSchemaBoolean<C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, boolean>,
    def: boolean
  ): boolean;
  getSchemaArray<T extends string | number | boolean, C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, Array<T>>,
    def: Array<T>
  ): Array<T>;
}

export namespace NDiscoveryService {
  export type SentryLogLevels = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';

  export type EnvsConfig = {
    adapters: {
      http: {
        enable: boolean
        connect: {
          protocol: string
          host: string
          port: number
        }
        urls: {
          api: string
          exception: string
        }

        refresh: {
          url: string
          method: HttpMethod
        }
      }
      ws: {
        enable: boolean;
        connect: {
          protocol: 'ws' | 'wss';
          host: string;
          port: number;
        };
        refresh: {
          url: string
          method: HttpMethod
        }
      };
    };
    services: {
      localization: {
        fallbackLanguage: string;
        defaultLanguage: string;
        supportedLanguages: string[];
      };
      auth: {
        checkAccessDiff: number;
      };
    };
    integrations: {
      mapbox: {
        token: string;
      };
      sentry: {
        enable: boolean;
        token: string;
        logLevel: SentryLogLevels;
        tracesSampleRate: number;
        replaysSessionSampleRate: number;
        replaysOnErrorSampleRate: number;
      };
    };
    strategies: {
      database: {
        enable: boolean;
        type: string;
        name: string;
        defaultVersion: number;
      };
    };
  };

  export type KeyBuilder<
    T,
    F extends string | boolean | number | (string | boolean | number)[],
  > = T extends Record<string, unknown>
    ? {
      [K in keyof T]: T[K] extends F
        ? `${string & K}`
        : K extends string
          ? `${string & K}.${KeyBuilder<T[K], F>}`
          : never;
    }[keyof T]
    : string;
}
