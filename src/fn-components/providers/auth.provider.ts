import { injectable, inject, jwt } from '~packages';
import { container } from '~container';
import { CoreSymbols } from '~symbols';
import { Guards } from '../utils';

import type {
  IAuthProvider,
  IDiscoveryService,
  IStorageStrategy,
  NAuthProvider,
} from '~types';

@injectable()
export class AuthProvider implements IAuthProvider {
  constructor(
    @inject(CoreSymbols.DiscoveryService)
    private readonly _discoveryService: IDiscoveryService,
  ) {
  }

  public setTokens(access: string, refresh: string): void {
    const storage = container.get<IStorageStrategy>(CoreSymbols.LocalStorageStrategy);

    storage.setItem<string>('x-user-access-token', access);
    storage.setItem<string>('x-user-refresh-token', refresh);
  }

  public getTokenPayload<P>(): P {
    const scope = this.getAuthScope()

    let payload: P
    switch (scope.status) {
      case 'access:actual':
      case 'access:expired':
        payload = this._decodeJWT<P>(scope.token).payload
        break
      case 'refresh:expired':
        throw new Error('Token expired')
    }

    return payload
  }

  public updateAccessToken(token: string): void {
    container
      .get<IStorageStrategy>(CoreSymbols.LocalStorageStrategy)
      .setItem<string>('x-user-access-token', token);
  }

  public getAuthScope(): NAuthProvider.AuthScope {
    const access = this._isTokenExpired('x-user-access-token')
    if (access) {
      return {
        status: 'access:actual',
        token: access
      }
    }

    const refresh = this._isTokenExpired('x-user-refresh-token')
    if (refresh) {
      return  {
        status: 'access:expired',
        token: refresh
      }
    }

    return {status: 'refresh:expired'}
  }

  private _isTokenExpired(type: NAuthProvider.AuthHeaders): string | null {
    const token = container
      .get<IStorageStrategy>(CoreSymbols.LocalStorageStrategy)
      .getString(type, '');

    if (token.length === 0) return null

      const checkAccessDiff = this._discoveryService.getNumber('services.auth.checkAccessDiff', 30)
      const { exp } = this._decodeJWT(token);
      const current = Math.round(Date.now() / 1000);
      const diff = exp - (current + checkAccessDiff);
      if (diff < 0) return null

    return token
  }

  private _decodeJWT<T>(token: string): { exp: number; iat: number; diff: number; payload: T } {
    const payload = jwt.decode<NAuthProvider.JwtAuthStructure<T>>(token);

    if (!Guards.isJwtAuthPayload(payload)) {
      throw new Error('JWt token has invalid structure. ');
    }

    return {
      exp: payload.exp,
      iat: payload.iat,
      diff: payload.exp - payload.iat,
      payload: payload.payload
    };
  }
}
