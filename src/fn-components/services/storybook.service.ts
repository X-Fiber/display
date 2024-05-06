import { injectable } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { SCHEME_STORYBOOKS } from '~common';
import { AbstractService } from './abstract.service';

import type { IStorybookLoader, IStorybookService, NStorybookService } from '~types';

@injectable()
export class StorybookService extends AbstractService implements IStorybookService {
  protected _SERVICE_NAME = StorybookService.name;
  private _loader: IStorybookLoader | undefined;
  private _STORAGE: Map<string, NStorybookService.Storybook> | undefined;

  constructor() {
    super();
  }

  public init(): boolean {
    this._loader = container.get<IStorybookLoader>(CoreSymbols.StorybookLoader);

    if (!SCHEME_STORYBOOKS || SCHEME_STORYBOOKS.length === 0) {
      throw new Error('Storybook collection not initialize.');
    }

    this._loader.init();
    this._loader.setStorybooks(SCHEME_STORYBOOKS);
    this._STORAGE = this._loader.storybooks;

    return true;
  }

  public destroy(): void {
    this._loader = undefined;
    this._STORAGE = undefined;
  }

  public get storage() {
    if (!this._STORAGE) {
      throw new Error('Storybook collection not initialize.');
    }

    return this._STORAGE;
  }
}
