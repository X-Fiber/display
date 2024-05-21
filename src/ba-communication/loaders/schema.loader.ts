import { injectable } from '~packages';

import type {
  AnyFunction,
  ExtendedRecordObject,
  ISchemaLoader,
  NSchemaLoader,
  NSchemaService,
} from '~types';

@injectable()
export class SchemaLoader implements ISchemaLoader {
  private _services: NSchemaService.BusinessScheme | undefined;

  public init(): void {
    this._services = new Map<string, NSchemaService.Domains>();
  }

  public destroy(): void {
    this._services = undefined;
  }

  public get services(): NSchemaService.BusinessScheme {
    if (!this._services) {
      throw new Error('Schema collection not initialize.');
    }

    return this._services;
  }

  public setBusinessLogic(structures: NSchemaLoader.ServiceStructure[]) {
    structures.forEach((service) => {
      service.domains.forEach((domain) => {
        this._setDomain(service.name, domain);
      });
    });
  }

  private _setDomain(service: string, structure: NSchemaLoader.DomainStructure) {
    const sService = this.services.get(service);
    if (!sService) {
      const collection = new Map<string, NSchemaService.Documents>();
      this.services.set(service, collection);
      this._setDomain(service, structure);
      return;
    }


    const documents: NSchemaService.Documents = {
      controller: new Map<string, NSchemaService.Controller>(),
      emitter: new Map<string, NSchemaService.EmitterEvent>(),
      dictionaries: new Map<string, ExtendedRecordObject>(),
      store: null,
      views: new Map<string, NSchemaService.ViewHandler<'public'>>(),
      validator: new Map<string, NSchemaService.ValidatorHandler>(),
      helper: new Map<string, AnyFunction>(),
    };

    if (structure.documents.controller) {
      documents.controller = this._setController(structure.documents.controller);
    }
    if (structure.documents.emitter) {
      documents.emitter = this._setSubscriber(structure.documents.emitter);
    }
    if (structure.documents.dictionary) {
      documents.dictionaries = this._setDictionary(structure.documents.dictionary);
    }
    if (structure.documents.store) {
      documents.store = structure.documents.store;
    }
    if (structure.documents.views) {
      documents.views = this._setView(structure.documents.views);
    }
    if (structure.documents.validator) {
      documents.validator = this._setValidator(structure.documents.validator);
    }
    if (structure.documents.helper) {
      documents.helper = this._setHelper(structure.documents.helper);
    }

    sService.set(structure.name, documents)
  }

  private _setController(
    structure: NSchemaLoader.ControllerStructure<string>
  ): Map<string, NSchemaService.Controller> {
    const collection = new Map<string, NSchemaService.Controller>();

    for (const name in structure) {
      const handler = structure[name];
      collection.set(name, handler);
    }

    return collection;
  }

  private _setSubscriber(
    structure: NSchemaLoader.EmitterStructure
  ): Map<string, NSchemaService.EmitterEvent> {
    const collection = new Map<string, NSchemaService.EmitterEvent>();

    for (const name in structure) {
      const handler = structure[name];
      collection.set(name, handler);
    }

    return collection;
  }

  private _setDictionary(
    structure:
      | NSchemaLoader.DictionaryStructure<string, Record<string, ExtendedRecordObject>>
      | NSchemaLoader.DictionaryStructure<string, Record<string, ExtendedRecordObject>>[]
  ): Map<string, NSchemaService.Dictionary> {
    const collection = new Map<string, NSchemaService.Dictionary>();

    if (Array.isArray(structure)) {
      structure.forEach((dictionary) => collection.set(dictionary.language, dictionary.dictionary));
    } else {
      collection.set(structure.language, structure.dictionary);
    }
    return collection;
  }

  private _setView(
    structure:
      | NSchemaLoader.ViewStructure<string, 'public'>
      | NSchemaLoader.ViewStructure<string, 'public'>[]
  ): Map<string, NSchemaService.ViewHandler<'public'>> {
    const collection = new Map<string, NSchemaService.ViewHandler<'public'>>();

    if (Array.isArray(structure)) {
      structure.forEach((view) => collection.set(view.name, view.view));
    } else {
      collection.set(structure.name, structure.view);
    }

    return collection;
  }

  private _setValidator(
    structure: NSchemaLoader.ValidatorStructure
  ): Map<string, NSchemaService.ValidatorHandler> {
    const collection = new Map<string, NSchemaService.ValidatorHandler>();

    for (const name in structure) {
      const handler = structure[name];
      collection.set(name, handler);
    }

    return collection;
  }

  private _setHelper(
    structure: NSchemaLoader.HelperStructure<Record<string, AnyFunction>>
  ): Map<string, AnyFunction> {
    const collection = new Map<string, AnyFunction>();

    for (const name in structure) {
      const handler = structure[name];
      collection.set(name, handler);
    }

    return collection;
  }
}
