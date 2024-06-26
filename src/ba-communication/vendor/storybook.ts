import type { NStorybookLoader, NStorybookService } from '~types';

export const setComponent = <N extends string, P = any>(
  name: N,
  component: NStorybookService.Component<P>
): NStorybookLoader.ComponentStructure<P> => {
  return { name, component };
};

export const setSpace = <S extends string>(
  name: S,
  components: NStorybookLoader.ComponentStructure | NStorybookLoader.ComponentStructure[]
): NStorybookLoader.SpaceStructure => {
  return { name, components: Array.isArray(components) ? components : [components] };
};

export const setStorybook = <N extends string>(
  name: N,
  spaces: NStorybookLoader.SpaceStructure[]
): NStorybookLoader.StorybookStructure => {
  return { name, spaces };
};

export const setStorybooks = (
  structure: NStorybookLoader.StorybookStructure | NStorybookLoader.StorybookStructure[]
): NStorybookLoader.StorybookStructure[] => {
  return Array.isArray(structure) ? structure : [structure];
};
