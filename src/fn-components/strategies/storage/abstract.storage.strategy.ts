import { injectable } from '~packages';
import type { IStorageStrategy } from '~types';

@injectable()
export abstract class AbstractStorageStrategy implements IStorageStrategy {
  protected abstract readonly storage: typeof localStorage | typeof sessionStorage;

  public get length(): number {
    return this.storage.length;
  }

  public setItem(key: string, value: unknown): void {
    const val = typeof value !== 'string' ? JSON.stringify(value) : value;
    this.storage.setItem(key, val);
  }

  public getMandatory<T>(name: string): T | string {
    return this._getItem<T>(name);
  }

  public getString(key: string, def: string): string {
    return this._getItem<string>(key, def);
  }

  public getNumber(key: string, def: number): number {
    const item = this._getItem<number>(key, def);
    try {
      return Number(item);
    } catch (_) {
      return def;
    }
  }

  public getBoolean(name: string, def: boolean): boolean {
    const item = this._getItem<boolean>(name, def);

    if (typeof item !== 'boolean') {
      try {
        return Boolean(item);
      } catch (_) {
        return def;
      }
    }
    return item;
  }

  public getObject<T>(name: string, def: T): T {
    const item = this._getItem<T>(name, def);
    if (typeof item === 'string') {
      try {
        return JSON.parse(item);
      } catch {
        return def;
      }
    } else {
      return item;
    }
  }

  public getArray<T>(name: string, def: Array<T>): Array<T> {
    const item = this._getItem<Array<T>>(name, def);
    if (typeof item === 'string') {
      try {
        return Array(JSON.parse(item));
      } catch {
        return def;
      }
    } else {
      return item;
    }
  }

  private _getItem<T>(key: string, def?: T): string | T {
    const item = this.storage.getItem(key);
    if (item) {
      return item;
    } else {
      if (def) {
        return def;
      } else {
        throw new Error('Key into storage not found.');
      }
    }
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  public clear(): void {
    this.storage.clear();
  }
}
