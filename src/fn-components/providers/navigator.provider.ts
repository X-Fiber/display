import { injectable } from '~packages';

import type { INavigatorProvider, NNavigatorProvider } from '~types';

@injectable()
export class NavigatorProvider implements INavigatorProvider {
  private _navigator: typeof navigator = navigator;

  public get cookieEnabled(): boolean {
    return this._navigator.cookieEnabled;
  }

  public get isOnline(): boolean {
    return this._navigator.onLine;
  }

  public get userAgent(): string {
    return this._navigator.userAgent;
  }

  public get networkInfo(): NNavigatorProvider.NetworkInfo {
    if ('connection' in this._navigator) {
      return {
        status: 'OK',
        connection: this._navigator.connection as NNavigatorProvider.ConnectionInfo,
      };
    } else {
      return {
        status: 'FAIL',
        message: 'Connection info not available in this browser',
      };
    }
  }

  public get defaultLanguage(): NNavigatorProvider.LanguagePayload {
    const languageCases = this._navigator.language.split('-');

    return {
      shortLn: languageCases[0],
      regionLn: languageCases[1],
      fullLn: this._navigator.language,
    };
  }

  public get supportedLanguages(): NNavigatorProvider.LanguagePayload[] {
    return this._navigator.languages.map((language) => {
      const ln = language.split('-');

      return {
        shortLn: ln[0],
        regionLn: ln[1],
        fullLn: language,
      };
    });
  }

  public useCoordinates(
    successCallback: NNavigatorProvider.SuccessCallback,
    errorCallback: NNavigatorProvider.ErrorCallback
  ): void {
    if ('geolocation' in this._navigator) {
      this._navigator.geolocation.getCurrentPosition(
        (position) => successCallback(position.coords),
        (positionError) => {
          let code: NNavigatorProvider.ErrorCode;
          switch (positionError.code) {
            case positionError.PERMISSION_DENIED:
              code = 'PERMISSION_DENIED';
              break;
            case positionError.TIMEOUT:
              code = 'TIMEOUT';
              break;
            case positionError.POSITION_UNAVAILABLE:
              code = 'POSITION_UNAVAILABLE';
              break;
            default:
              code = 'UNSUPPORTED_GEOLOCATION';
          }

          errorCallback({ code: code, message: positionError.message });
        }
      );
    } else {
      errorCallback({
        code: 'UNSUPPORTED_GEOLOCATION',
        message: 'Geolocation not supported in this browser',
      });
    }
  }
}
