import { injectable, inject, joi } from '~packages';
import { CoreSymbols } from '~symbols';
import { container } from '~container';
import { SCHEME_SERVICES } from '~common';
import { AbstractService } from './abstract.service';

import type {
  Joi,
  NestedObject,
  KeyStringLiteralBuilder,
  IFunctionalityAgent,
  ISchemaAgent,
  ISchemaLoader,
  ISchemeService,
  NSchemaService,
} from '~types';

@injectable()
export class SchemeService extends AbstractService implements ISchemeService {
  protected _SERVICE_NAME = SchemeService.name;
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
    const sStorage = this.services.get(service);
    if (!sStorage) {
      throw new Error(`Service "${service}" not found.`);
    }

    const dStorage = sStorage.get(domain);
    if (!dStorage) {
      throw new Error(`Domain "${domain}" not found in "${service}" service.`);
    }

    return dStorage;
  }

  public getController<T>(service: string, domain: string): T {
    const storage = this._getDomainStorage(service, domain);

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
          fnAgent: container.get<IFunctionalityAgent>(CoreSymbols.FunctionalityAgent),
          schemaAgent: container.get<ISchemaAgent>(CoreSymbols.SchemaAgent),
        };

        const context: NSchemaService.Context<'private'> = {
          store: '',
          user: undefined,
        };

        if (!structure) return undefined;

        switch (structure.scope) {
          case 'public':
            context['user'] = undefined;
            break;
          case 'private':
            // TODO: implement session context
            context['user'] = {};
            break;
        }

        return structure.handler(agents, context, args) as T[keyof T];
      }
    }

    return new Controller(storage.controller) as T;
  }

  public getDictionary<DICT extends NestedObject = NestedObject>(
    service: string,
    domain: string,
    language: string
  ): DICT {
    const sStorage = this.services.get(service);
    if (!sStorage) {
      throw new Error(`Service storage '${service}' not found`);
    }

    const dStorage = sStorage.get(domain);

    if (!dStorage) {
      throw new Error(`Domain storage '${domain}' not found in service '${service}'`);
    }

    const dictionary: DICT = dStorage.dictionaries.get(language);
    if (!dictionary) {
      throw new Error(
        `Dictionary with '${language}' type not found in domain '${domain}' in service '${service}'`
      );
    }

    return dictionary;
  }

  public getResource<DICT extends NestedObject = NestedObject>(
    service: string,
    domain: string,
    resource: KeyStringLiteralBuilder<DICT>,
    language: string,
    substitutions?: Record<string, string>
  ): string {
    const dictionary = this.getDictionary<DICT>(service, domain, language);
    if (!dictionary) {
      throw new Error(`Dictionary with "${language}" type not found`);
    }

    try {
      const keys = resource.split('.');
      let record: NSchemaService.Dictionary | string = dictionary;

      if (keys.length > 1) {
        for (const key of keys) {
          if (typeof record !== 'string') {
            record = record[key];
          } else {
            if (substitutions) {
              for (const substitution in substitutions) {
                if (typeof record !== 'string') {
                  record = record.replace('{{' + substitution + '}}', substitutions[substitution]);
                }
              }
              return record;
            } else {
              return record;
            }
          }
        }
        return record;
      } else {
        return record[resource];
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public getValidator<T extends Record<string, unknown>>(
    service: string,
    domain: string
  ): NSchemaService.ValidateObject<T> {
    const storage = this._getDomainStorage(service, domain);

    class Validator {
      private readonly _handlers: Map<string, NSchemaService.ValidatorHandler>;

      constructor(handlers: Map<string, NSchemaService.ValidatorHandler>) {
        this._handlers = handlers;

        for (const [name] of this._handlers) {
          Object.defineProperty(this, name, {
            value: () => this._runMethod(name),
            writable: true,
            configurable: true,
          });
        }
      }

      private _runMethod(name: string): Joi.ObjectSchema<T> | undefined {
        const handler = this._handlers.get(name);

        const localization: NSchemaService.Localization = {
          getResource: container.get<ISchemaAgent>(CoreSymbols.SchemaAgent).getResource,
        };

        if (!handler) return undefined;

        return handler(joi, localization);
      }
    }

    return new Validator(storage.validator) as unknown as NSchemaService.ValidateObject<T>;
  }
}
