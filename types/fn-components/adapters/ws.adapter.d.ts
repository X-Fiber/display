import type { IAbstractAdapter } from './abstract.adapter';
import type { AnyFunction } from '../../utils';

export interface IWsAdapter extends IAbstractAdapter {
  init(): boolean;
  destroy(): void;

  subscribe(event: NWsAdapter.EmitterEvent, listener: (...args: any) => void): void;
  unsubscribe(event: NWsAdapter.EmitterEvent, listener?: (...args: any) => void): void;

  once<E extends string = string>(
    type: NWsAdapter.AllEventType,
    version: NWsAdapter.Version,
    event: E,
    listener: AnyFunction
  ): void;
  on<E extends string = string>(
    type: NWsAdapter.PublicEventType,
    version: NWsAdapter.Version,
    event: E,
    listener: AnyFunction
  ): void;
  sendToSession<T = any>(payload: NWsAdapter.SessionToSessionPayload<T>): void;
  sendToRoom<T = any>(payload: NWsAdapter.SessionToRoomPayload<T>): void;
  sendToService<T = any>(payload: NWsAdapter.SessionToServicePayload<T>): void;
}

export namespace NWsAdapter {
  export type Version = 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | string;
  export type AuthScope = 'public' | 'private';
  export type EmitterEvent = 'handshake' | 'validation' | 'communication';

  export type AllEventType =
    | 'handshake'
    | 'handshake.error'
    | 'validation.error.unknown_event'
    | 'validation.error.unknown_event_kind'
    | 'validation.error.invalid_data_structure'
    | 'validation.error.service_not_found'
    | 'validation.error.domain_not_found'
    | 'validation.error.event_not_found'
    | 'session:to:session'
    | 'session:to:room'
    | 'session:to:service';

  export type ServerHandshakePayload = {
    code: string;
    message: string;
  };

  export type EventErrorPayload = {
    code: string;
    message: string;
  };

  export interface BasePayload<P = any> {
    service: string;
    domain: string;
    event: string;
    scope: NWsAdapter.AuthScope;
    version: Version;
    data: P;
  }

  export type SessionToSessionPayload<D = any> = BasePayload<D> & { sessionId: string };
  export type SessionToRoomPayload<D = any> = BasePayload<D> & { roomId: string };
  export type SessionToServicePayload<D = any> = BasePayload<D>;

  export type EventPayload<
    E extends PublicEventType = PublicEventType,
    D = any
  > = E extends 'session:to:session'
    ? SessionToSessionPayload<D>
    : E extends 'session:to:room'
    ? SessionToRoomPayload<D>
    : E extends 'session:to:service'
    ? SessionToServicePayload<D>
    : never;

  export type AllEventPayload<T extends AllEventType, P = any> = T extends 'handshake'
    ? ServerHandshakePayload
    : T extends 'handshake.error'
    ? EventErrorPayload
    : T extends 'validation.error.unknown_event'
    ? EventErrorPayload
    : T extends 'validation.error.unknown_event_kind'
    ? EventErrorPayload
    : T extends 'validation.error.invalid_data_structure'
    ? EventErrorPayload
    : T extends 'validation.error.service_not_found'
    ? EventErrorPayload
    : T extends 'validation.error.domain_not_found'
    ? EventErrorPayload
    : T extends 'validation.error.event_not_found'
    ? EventErrorPayload
    : T extends 'session:to:session'
    ? SessionToSessionPayload<P>
    : T extends 'session:to:room'
    ? SessionToRoomPayload<P>
    : T extends 'session:to:service'
    ? SessionToServicePayload<P>
    : never;

  export type PublicEventType = 'session:to:session' | 'session:to:room' | 'session:to:service';

  export type ServerEventPayload = {
    service: string;
    domain: string;
    event: string;
    scope: NWsAdapter.AuthScope;
    version: Version;
    data: P;
  };

  export type ServerPayload<T extends AllEventType> = T extends 'handshake'
    ? ServerHandshakePayload
    : T extends 'session:to:session'
    ? ServerEventPayload
    : never;

  export type EventKind = 'handshake' | 'validation' | 'communication';

  export type ServerEvent<T extends AllEventType = AllEventType, P = any> = {
    kind: EventKind;
    event: T;
    payload: ServerPayload;
  };
}
