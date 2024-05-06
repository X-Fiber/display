import { axios, injectable } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { AuthHeaders } from '~common';

import type {
  IAbstractAdapter,
  IAuthProvider,
  IDiscoveryService,
  IStorageProvider,
  NAbstractAdapter,
} from '~types';

@injectable()
export abstract class AbstractAdapter<C extends NAbstractAdapter.AdapterKind> implements IAbstractAdapter {
  protected abstract _discoveryService: IDiscoveryService;
  protected abstract _config: NAbstractAdapter.Config<C>;

  public abstract init(): boolean;
  public abstract destroy(): void;

  protected async resolveAuthScope(): Promise<string | null> {


    const auth = container.get<IAuthProvider>(CoreSymbols.AuthProvider);
    const storage = container.get<IStorageProvider>(CoreSymbols.StorageProvider);

    const access = storage.localStorage.getString(AuthHeaders.ACCESS_TOKEN, '');
    if (access && access.length > 0) return access;

    const refresh = storage.localStorage.getString(AuthHeaders.REFRESH_TOKEN, '');
    if (!refresh || refresh.length === 0) return null

    let url = ''

    if ('http' in this._config) {
      const {protocol, host, port} = this._config.http
      url = `${protocol}://${host}:${port}/`
    } else {
      const {protocol, host, port} = this._config.connect
      url = `${protocol}://${host}:${port}/`
    }


    const response = await axios.request({
      baseURL: this._config.refresh.url,
      method: this._config.refresh.method,
      url: url,
      headers: {
        [AuthHeaders.REFRESH_TOKEN]: refresh,
      },
    });

    const token: string = response.headers[AuthHeaders.ACCESS_TOKEN];
    if (!token || token.length === 0) return null
    auth.updateAccessToken(access)
    return token
    }
}