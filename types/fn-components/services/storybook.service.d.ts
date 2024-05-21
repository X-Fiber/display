import type { JSX } from 'react';
import type { IAbstractService } from './abstract.service';

export interface IStorybookService extends IAbstractService {
  readonly storage: Map<string, NStorybookService.Storybook>;
}

export namespace NStorybookService {
  export type Component<P = any> = (props: P) => JSX.Element<P>;
  export type Space = Map<string, Component>;
  export type Storybook = Map<string, Space>;
}
