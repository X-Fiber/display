import type { IAbstractAdapter } from './abstract.adapter';
import type { Axios } from '../../packages';
import type { HttpMethod } from '../../utils';

export interface IHttpAdapter extends IAbstractAdapter {
  init(): boolean;
  destroy(): void;

  request<
    S extends string = string,
    D extends string = string,
    R extends string = string,
    DA = any,
    RES = any,
  >(
    service: S,
    domain: D,
    route: R,
    options: NHttpAdapter.RequestOptions<DA>
  ): Promise<NHttpAdapter.Response<RES>>;
}

export namespace NHttpAdapter {
  export type QueryParameter =
    | 'string'
    | 'string[]'
    | 'number'
    | 'number[]'
    | 'boolean'
    | 'boolean[]';

  export type AuthScope = 'public:route' | 'private:route';
  export type RequestOptions<DA = any> = {
    version?: string;
    scope?: AuthScope;
    method?: HttpMethod;
    data?: DA | null;
    headers?: Record<string, string> & Partial<{ 'x-user-access-token': string }>;
    params?: Record<string, string>;
    queries?: Record<string, QueryParameter>;
  };

  export type Response<R> = {
    body: Axios.AxiosResponse<R>['data'];
    status: Axios.AxiosResponse<R>['status'];
    headers: Axios.AxiosResponse<R>['headers'];
    request: Axios.AxiosResponse<R>['request'];
  };
}
