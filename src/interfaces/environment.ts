type EnvironmentPrefix = 'server' | 'db';

export type Environment = {
  [key: `${Uppercase<EnvironmentPrefix>}_${string}`]: string;
} & { DB_PORT: number; SERVER_PORT: number };
