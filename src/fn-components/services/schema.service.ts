import { injectable, inject } from '~packages';
import { CoreSymbols } from '~symbols';
import { container } from '~container';
import { SCHEME_SERVICES } from '~common';
import { AbstractService } from './abstract.service';

import type {
  IFunctionalityAgent, ISchemaAgent,
  ISchemaLoader,
  ISchemeService,
  NSchemaService,
} from '~types';

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

    return true;
  }

  protected destroy(): void {
    this._SCHEME = undefined;
    this._schemaLoader.destroy();
  }

  private _getDomainStorage(service: string, domain: string): NSchemaService.Documents {
    const sStorage = this.services.get(service)
    if (!sStorage) {
      throw new Error(`Service "${service}" not found.`);
    }

    const dStorage = sStorage.get(domain)
    if (!dStorage) {
      throw new Error(`Domain "${domain}" not found in "${service}" service.`);
    }

    return dStorage
  }

  public getController<T>(service:string, domain: string, controller: string): T {
    const storage = this._getDomainStorage(service, domain)
    const handler = storage.controller.get(controller)


    class Controller {
      private readonly _handlers: Map<string, NSchemaService.Controller>;

      constructor(handlers: Map<string, NSchemaService.Controller>) {
        this._handlers = handlers;

        for (const [name] of this._handlers) {
          Object.defineProperty(this, name, {
            value: (args: any) => this._runMethod(name, args),
            writable: true,
            configurable: true,
          });
        }
      }

      private _runMethod(name: string, args: any[]): T[keyof T] | undefined {
        const structure = this._handlers.get(name);

        const agents: NSchemaService.Agents = {
          fnAgent: container.get<IFunctionalityAgent>(
            CoreSymbols.FunctionalityAgent
          ),
          schemaAgent: container.get<ISchemaAgent>(
            CoreSymbols.SchemaAgent
          )
        }

        const context: NSchemaService.Context<'private'> = {
          store: '',
          user: undefined,
        }

        if (!structure) return undefined

        switch (structure.scope) {
          case 'public':
            context['user'] = undefined
            break
          case 'private':

            // TODO: implement session context
            context['user'] = {}
            break
        }


        return structure.handler(agents, context, args) as T[keyof T]
      }
    }

    return new Controller(storage.controller) as T;
  }

  public getStore = (service: string, domain: string):any => {
    console.log(service);
  }
}
