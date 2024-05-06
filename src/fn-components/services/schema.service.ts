import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';
import { SCHEME_SERVICES } from '~common';
import { AbstractService } from './abstract.service';

import type { ISchemaLoader, ISchemeService, NSchemaService } from '~types';

@injectable()
export class SchemaService extends AbstractService implements ISchemeService {
  protected _SERVICE_NAME = SchemaService.name;
  private _SCHEME: NSchemaService.BusinessScheme | undefined;

  constructor(
    @inject(CoreSymbols.SchemaLoader)
    private readonly _schemaLoader: ISchemaLoader
  ) {
    super();
  }

  public get services(): NSchemaService.BusinessScheme {
    if (!this._SCHEME) {
      throw new Error('Schema collection not initialize.');
    }

    return this._SCHEME;
  }

  protected init(): boolean {
    this._schemaLoader.init();
    if (!SCHEME_SERVICES || SCHEME_SERVICES.length === 0) {
      console.warn('Schema service array is empty');
    }


    this._schemaLoader.setBusinessLogic(SCHEME_SERVICES);
    this._SCHEME = this._schemaLoader.services;

    console.log('@services', this._SCHEME);

    return true;
  }

  protected destroy(): void {
    this._SCHEME = undefined;
    this._schemaLoader.destroy();
  }
}
