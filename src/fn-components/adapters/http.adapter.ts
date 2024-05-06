import { injectable, inject, axios } from '~packages';
import { CoreSymbols } from '~symbols';
import { AuthHeaders } from '~common';
import { AbstractAdapter } from './abstract.adapter';

import type{
  Axios, HttpMethod,
  IDiscoveryService,
  IHttpAdapter,
  ISchemeService,
  NAbstractAdapter,
  NHttpAdapter,
} from '~types';


@injectable()
export class HttpAdapter extends AbstractAdapter<'http'> implements IHttpAdapter {
  protected _config: NAbstractAdapter.HttpConfig
  protected _requester: Axios.AxiosInstance

  constructor(
    @inject(CoreSymbols.DiscoveryService)
    protected readonly _discoveryService: IDiscoveryService,
    @inject(CoreSymbols.SchemeService)
    private readonly _schemaService: ISchemeService,
  ) {
    super()
    this._requester = axios.create();

    this._config = {
      enable: false,
      connect: {
        protocol: 'http',
        host: '0.0.0.0',
        port: 11000
      },
      urls: {
        api:  'v1/call/api',
        exception: 'v1/exception-tunnel'
      },
      refresh: {
        url: 'v1/update-token',
        method: 'PATCH'
      }
    }
  }

  private _setConfig(): NAbstractAdapter.HttpConfig {
    return {
      enable: this._discoveryService.getBoolean('adapters.http.enable', this._config.enable),
      connect: {
        protocol: this._discoveryService.getString('adapters.http.connect.protocol', this._config.connect.protocol),
        host: this._discoveryService.getString('adapters.http.connect.host', this._config.connect.host),
        port: this._discoveryService.getNumber('adapters.http.connect.port', this._config.connect.port),
      },
      urls: {
        api: this._discoveryService.getString(
          'adapters.http.urls.api',
          this._config.urls.api
        ),
        exception: this._discoveryService.getString(
          'adapters.http.urls.exception',
          this._config.urls.api
        ),
      },
      refresh: {
        url: this._discoveryService.getString(
          'adapters.http.urls.api',
          this._config.refresh.url
        ),
        method: this._discoveryService.getString(
          'adapters.http.urls.api',
          this._config.refresh.method
        ) as HttpMethod,
      }
    }
  }

  public init(): boolean {
    if (!this._config.enable) return false

    // TODO: implement _requester 401 / 403 interceptor

    try {
      this._config = this._setConfig()

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public destroy(): void {
    this._requester = undefined;
  }

  public async request<
    S extends string = string,
    D extends string = string,
    R extends string = string,
    DA = any,
    RES = any,
  >(service: S,
    domain: D,
    route: R, options: NHttpAdapter.RequestOptions<DA>): Promise<NHttpAdapter.Response<RES>> {
    const config: NHttpAdapter.RequestOptions = {
      method: options.method ?? 'GET',
      version: options.version ?? 'v1',
      scope: options.scope ?? 'public:route',
      data: options.data ?? null,
      headers: options.headers ?? undefined,
      params: options.params ?? undefined,
      queries: options.queries ?? undefined,
    };

    const sStorage = this._schemaService.services.get(service);
    if (!sStorage) {
      const services = Array.from(this._schemaService.services.keys());
      let msg: string;
      if (services.length > 0) {
        msg = 'Service storage is empty.';
      } else {
        msg = `Available next services: ${services.join(', ')}. `;
      }

      throw new Error(`Service storage "${service}" not found. ${msg}`);
    }

    const dStorage = sStorage.get(domain);
    if (!dStorage) {
      const domains = Array.from(sStorage.keys());
      let msg: string;
      if (domains.length > 0) {
        msg = 'Domain storage is empty.';
      } else {
        msg = `Available next domains: ${domains.join(', ')}. `;
      }

      throw new Error(
        `Domain storage "${domain}" in service "${service}" not found. ${msg}`
      );
    }

    const { protocol, host, port } = this._config.connect;
      let queries = '';
      if (config.queries && Object.keys(config.queries).length > 0) {
        queries =
          '?' +
          Object.entries(config.queries)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
      }

      switch (config.scope) {
        case 'public:route':
          break;
        case 'private:route':
          const token = await this.resolveAuthScope()
          if (token) {
            if (!options.headers) {
              options.headers = { [AuthHeaders.ACCESS_TOKEN]: token }
            } else {
              options.headers[AuthHeaders.ACCESS_TOKEN] = token
            }
          } else {
            throw new Error('Token expired');
          }
      }

    try {
      const response = await this._requester.request<RES>({
        url: `${protocol}://${host}:${port}${this._config.urls.api}/${service}${domain}/${config.version}/${route}${queries}`,
        headers: options.headers,
        method: options.method,
        data: options.data,
        params: options.params,
      });

      return {
        body: response.data,
        status: response.status,
        headers: response.headers,
        request: response.request,
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
