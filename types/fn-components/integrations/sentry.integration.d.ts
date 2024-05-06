import type { IAbstractIntegration } from './abstract.integration';
import type { NDiscoveryService } from '../services';

export interface ISentryIntegration extends IAbstractIntegration {
  captureException(exception: any): void;
  captureFatalMessage(message: string): void;
  captureErrorMessage(message: string): void;
  captureWarningMessage(message: string): void;
  captureLogMessage(message: string): void;
  captureInfoMessage(message: string): void;
  captureDebugMessage(message: string): void;
}

export namespace NSentryIntegration {
  export type Config = Pick<
    NDiscoveryService.EnvsConfig['integrations']['sentry'],
    | 'enable'
    | 'token'
    | 'tracesSampleRate'
    | 'replaysSessionSampleRate'
    | 'replaysOnErrorSampleRate'
    | 'logLevel'
  >
}
