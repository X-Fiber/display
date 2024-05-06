export interface INavigatorProvider {
  readonly cookieEnabled: boolean;
  readonly isOnline: boolean;
  readonly userAgent: string

  readonly networkInfo: NNavigatorProvider.NetworkInfo
  readonly defaultLanguage: NNavigatorProvider.LanguagePayload;
  readonly supportedLanguages: NNavigatorProvider.LanguagePayload[];

  readonly useCoordinates(
    successCallback: NNavigatorProvider.SuccessCallback,
    errorCallback: NNavigatorProvider.ErrorCallback
  ): void
}

export namespace NNavigatorProvider {
  export type LanguagePayload = {
    shortLn: string;
    regionLn: string;
    fullLn: string;
  };

  export interface BaseNetworkInfo {
    status: 'OK' | 'FAIL'
  }

  export type ConnectionInfo = {
    downlink: number
    effectiveType: string
    rtt: number
    saveDate: boolean
  }

  export interface NetworkInfoOk extends BaseNetworkInfo {
    status: 'OK'
    connection: ConnectionInfo
  }

  export interface NetworkInfoFAIL extends BaseNetworkInfo {
    status: 'FAIL'
    message: string
  }


  export type NetworkInfo = NetworkInfoOk | NetworkInfoFAIL

  export type ErrorCode =
    | 'PERMISSION_DENIED'
    | 'POSITION_UNAVAILABLE'
    | 'TIMEOUT'
    | 'UNSUPPORTED_GEOLOCATION';
  export type ErrorStructure = {
    code: ErrorCode;
    message: string;
  };
  export type SuccessCallback = (coords: GeolocationCoordinates) => void;
  export type ErrorCallback = (errorStructure: ErrorStructure) => void;
}
