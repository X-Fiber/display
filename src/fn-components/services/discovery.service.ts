import { injectable } from '~packages';

import { AbstractService } from './abstract.service';

import type {
  IDiscoveryService,
  NDiscoveryService,
  AnyObject, ExtendedRecordObject
} from '~types';

@injectable()
export class DiscoveryService extends AbstractService implements IDiscoveryService {
  protected readonly _SERVICE_NAME = DiscoveryService.name;
  private _CONFIG: NDiscoveryService.EnvsConfig | undefined;

  protected init(): boolean {

    this._CONFIG = this._parseConfig() as NDiscoveryService.EnvsConfig

    return true;
  }

  public get nodeEnv(): string {
    return process.env.NODE_ENV ?? 'development';
  }

  private _parseConfig() {
    return Object.entries(process.env)
      .filter(([key]) => key.startsWith('__x_fiber__'))
      .reduce((parsedEnv, [key, value]) => {
        const keys = key.substring('__x_fiber__'.length).split('_');
        keys.reduce((obj: any, currentKey, index) => {
          if (index === keys.length - 1) {
            obj[currentKey] = value;
          } else {
            return obj[currentKey] = obj[currentKey] || {};
          }
        }, parsedEnv);
        return parsedEnv;
      }, {});
  }

  protected destroy(): void {
    this._CONFIG = undefined;
  }

  public getMandatory<T extends string | number | boolean>(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, T>
  ): T {
    return this._getMandatory<T, NDiscoveryService.EnvsConfig>(name, 'core');
  }

  public getSchemaMandatory<T extends string | number | boolean, C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, T>
  ): T {
    return this._getMandatory<T, C>(name, 'schema');
  }

  private _getMandatory<T extends string | number | boolean, C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, T>,
    scope: 'core' | 'schema'
  ): T {
    const variable = this._get<T>(name, scope);
    if (typeof variable === 'undefined' || variable === '') {
      throw new Error(`Environment variable "${name}" not found`);
    }

    return variable;
  }

  public getString(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, string>,
    def: string
  ): string {
    return this._getString<NDiscoveryService.EnvsConfig>(name, def, 'core');
  }

  public getSchemaString<T extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<T, string>,
    def: string
  ): string {
    return this._getString<T>(name, def, 'schema');
  }

  private _getString<T extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<T, string>,
    def: string,
    scope: 'core' | 'schema'
  ): string {
    const variable = this._get<unknown>(name, scope, def);
    if (typeof variable !== 'string') {
      try {
        return String(variable);
      } catch {
        return def;
      }
    }
    return variable;
  }

  public getNumber(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, number>,
    def: number
  ): number {
    return this._getNumber<NDiscoveryService.EnvsConfig>(name, def, 'core');
  }

  public getSchemaNumber<T extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<T, number>,
    def: number
  ): number {
    return this._getNumber<T>(name, def, 'schema');
  }

  private _getNumber<T extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<T, number>,
    def: number,
    scope: 'core' | 'schema'
  ): number {
    const variable = this._get<unknown>(name, scope, def);

    if (typeof variable !== 'number') {
      try {
        return Number(variable);
      } catch {
        return def;
      }
    }
    return variable;
  }

  public getBoolean(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, boolean>,
    def: boolean
  ): boolean {
    return this._getBoolean<NDiscoveryService.EnvsConfig>(name, def, 'core');
  }

  public getSchemaBoolean<T extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<T, boolean>,
    def: boolean
  ): boolean {
    return this._getBoolean<T>(name, def, 'schema');
  }

  private _getBoolean<T extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<T, boolean>,
    def: boolean,
    scope: 'core' | 'schema'
  ): boolean {
    const variable = this._get<unknown>(name, scope, def);
    if (typeof variable !== 'boolean') {
      try {
        return Boolean(variable);
      } catch {
        return def;
      }
    }
    return variable;
  }

  public getArray<T extends string | number | boolean>(
    name: NDiscoveryService.KeyBuilder<NDiscoveryService.EnvsConfig, Array<T>>,
    def: Array<T>
  ): Array<T> {
    return this._getArray<T, NDiscoveryService.EnvsConfig>(name, def, 'core');
  }

  public getSchemaArray<T extends string | number | boolean, C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, Array<T>>,
    def: Array<T>
  ): Array<T> {
    return this._getArray<T, C>(name, def, 'core');
  }

  private _getArray<T extends string | number | boolean, C extends AnyObject>(
    name: NDiscoveryService.KeyBuilder<C, Array<T>>,
    def: Array<T>,
    scope: 'core' | 'schema'
  ): Array<T> {
    const variable = this._get<Array<T>>(name, scope, def);

    if (typeof variable !== 'object') {
      try {
        return Array(variable);
      } catch {
        return def;
      }
    }
    return variable;
  }

  protected _get<T>(name: string, scope: 'core' | 'schema', defaultValue?: T): T {
    name = scope === 'schema' ? `applications.${name}` : name;
    const names = name.split('.');

    let record: ExtendedRecordObject | string = {}
    for (const key of names) {
      if (record && typeof record === 'object') {
        record = record[key];
      }
    }

    if (record) {
      return record;
    } else {
      if (defaultValue || defaultValue === false) {
        return typeof record === 'undefined' ? defaultValue : record;
      } else {
        throw new Error(`Variable "${name}" not found`);
      }
    }
  }
}
