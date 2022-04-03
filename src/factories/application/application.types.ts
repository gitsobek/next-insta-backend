export enum ApplicationType {
  HTTP = 'http',
}

export interface Application {
  start: () => Promise<void>;
}