import type { NAuthProvider, NWsAdapter } from '~types';

export class Guards {
  public static isEventStructure = (x: unknown): x is NWsAdapter.ServerEvent => {
    return typeof x === 'object' && x !== null && 'event' in x && 'payload' in x;
  };

  public static isCorrectEvent = (x: string): x is NWsAdapter.AllEventType => {
    const events: (string | NWsAdapter.AllEventType)[] = [
      'handshake',
      'handshake.error',
      'validation.error.service_not_found',
      'validation.error.domain_not_found',
      'validation.error.event_not_found',
      'session:to:session',
      'session:to:room',
      'session:to:service',
    ];

    return events.includes(x);
  };

  public static isJwtAuthPayload = (x: unknown): x is NAuthProvider.JwtAuthStructure<unknown> => {
    return typeof x === 'object' && x !== null && 'iat' in x && 'exp' in x;
  };
}
