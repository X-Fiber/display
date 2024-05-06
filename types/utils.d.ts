export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'HEAD';
export type StrSym = string | symbol;
export type ExtendedRecordObject = Record<string, ExtendedRecordObject | string>;

export type StringObject = Record<string, string>;
export type NestedObject = Record<string, NestedObject | string>;
export type UnknownObject = Record<string, unknown>;
export type AnyObject = Record<string, any>;
export type Nullable<T> = T | null;

export type AnyFnWithArgs = (...args: any[]) => void;
export type AnyFnWithoutArgs = (...args: any[]) => void;
export type AnyFunction = AnyFnWithArgs | AnyFnWithoutArgs;

export type KeyStringLiteralBuilder<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: T[K] extends Record<string, unknown>
        ? `${string & K}.${KeyStringLiteralBuilder<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : string;
