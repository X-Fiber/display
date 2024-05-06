export interface IDatabaseStrategy {
  init(): void;
}

export namespace NDatabaseStrategy {
  export type Config = {
    enable: boolean;
    name: string;
    defaultVersion: number;
  };
}
