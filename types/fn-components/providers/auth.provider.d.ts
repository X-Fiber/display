export interface IAuthProvider {
  setTokens(access: string, refresh: string): void;
  getTokenPayload<P>(): P
  updateAccessToken(token: string): void;
}

export namespace NAuthProvider {
  export type AuthStatus = 'access:actual' | 'access:expired' | 'refresh:expired';
  export type AuthHeaders = 'x-user-access-token' | 'x-user-refresh-token';

  export type AuthScope<A extends AuthStatus = AuthStatus> =
    A extends 'access:actual' ?
      {
        status: 'access:actual';
        token: string;
      } :
      A extends 'access:expired' ? {
          status: 'access:expired';
          token: string;
        } :
        A extends 'refresh:expired' ? {
            status: 'refresh:expired';
          } :
          never

  export type JwtAuthStructure<T> = {
    exp: number;
    iat: number;
    jti: string;
    payload: T;
  };
}
