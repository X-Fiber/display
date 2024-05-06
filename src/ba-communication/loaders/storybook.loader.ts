import { injectable } from '~packages';
import { IStorybookLoader, NStorybookLoader, NStorybookService } from '~types';

@injectable()
export class StorybookLoader implements IStorybookLoader {
  private _STORYBOOKS: NStorybookLoader.Storybooks | undefined;

  public init(): void {
    this._STORYBOOKS = new Map<string, NStorybookLoader.Spaces>();
  }

  public destroy(): void {
    this._STORYBOOKS = undefined;
  }

  public get storybooks(): NStorybookLoader.Storybooks {
    if (!this._STORYBOOKS) {
      throw new Error('Storybook collection not initialize.');
    }

    return this._STORYBOOKS;
  }

  public setStorybooks(
    storybooks: NStorybookLoader.StorybookStructure | NStorybookLoader.StorybookStructure[]
  ): void {
    if (Array.isArray(storybooks)) {
      storybooks.forEach((storybook) => {
        storybook.spaces.forEach((space) => {
          this._setSpace(storybook.name, space);
        });
      });
    }
  }

  private _setSpace(storybook: string, structure: NStorybookLoader.SpaceStructure): void {
    const book = this._getStorybook(storybook);

    const components = book.get(structure.name);

    if (!components) {
      const collection = new Map<string, NStorybookService.Component>();
      structure.components.forEach((component) => {
        collection.set(component.name, component.component);
      });

      book.set(structure.name, collection);
    } else {
      structure.components.forEach((component) => {
        components.set(component.name, component.component);
      });
    }
  }

  private _getStorybook(storybook: string): NStorybookLoader.Spaces {
    const book = this.storybooks.get(storybook);
    if (!book) {
      const spaces = new Map<string, NStorybookLoader.Components>();
      this.storybooks.set(storybook, spaces);
      return spaces;
    } else {
      return book;
    }
  }
}
