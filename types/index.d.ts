export type * from './ba-communication'
export type * from './fn-components'
export type * from './utils'
export type * from './packages'

export interface IInitiator {
  start(): void;
  stop(): void;
}

