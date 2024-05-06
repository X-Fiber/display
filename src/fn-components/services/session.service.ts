import { injectable } from '~packages';
import { AbstractService } from './abstract.service';

import type { ISessionService } from '~types';

@injectable()
export class SessionService extends AbstractService implements ISessionService {
  protected _SERVICE_NAME = SessionService.name;

  constructor() {
    super();
  }

  protected init(): boolean {
    try {
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  public getSession<P>(): P {
    return '' as P
  }

  protected destroy(): void {
    console.log('');
  }
}
