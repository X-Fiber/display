import type { NStorybookService } from '../../fn-components';

export interface IStorybookLoader {
  readonly storybooks: Map<string, NStorybookService.Storybook>;

  init(): void;
  destroy(): void;
  setStorybooks(
    storybooks: NStorybookLoader.StorybookStructure | NStorybookLoader.StorybookStructure[]
  ): void;
}

export namespace NStorybookLoader {
  export type ComponentStructure<P = any> = {
    name: string;
    component: NStorybookService.Component<P>;
  };

  export type SpaceStructure = {
    name: string;
    components: ComponentStructure[];
  };

  export type StorybookStructure = {
    name: string;
    spaces: SpaceStructure[];
  };

  export type Components = Map<string, NStorybookService.Component>;
  export type Spaces = Map<string, Components>;
  export type Storybooks = Map<string, Spaces>;
}
