import { IDotenv } from '@next-insta/dotenv-typings';
import { existsSync } from 'fs';
import { Environment } from '../models/environment';

const dotenv: IDotenv = require('dotenv');

const environments = ['development', 'production', 'test'] as const;

export type EnvironmentTypes = typeof environments[number];

const loadEnvs = (): void | never => {
  let path: string;

  if (process.env.NODE_ENV === 'production') {
    path = '.env';
  } else {
    if (existsSync(`.env.${process.env.NODE_ENV}`)) {
      path = `.env.${process.env.NODE_ENV}`;
    } else {
      throw new Error('Environment file has not been found.');
    }
  }

  dotenv.config({ path });
};

const environment = (defaultValue: EnvironmentTypes = 'development'): EnvironmentTypes => {
  let env: any = process.env.NODE_ENV;

  if (!env) {
    env = process.env.NODE_ENV = defaultValue;
  }

  if (!environments.includes(env)) {
    throw new TypeError(`Invalid value for NODE_ENV variable. Accepted values are: ${environments.join(' | ')}.`);
  }

  return env;
};

const envString = (variable: keyof Environment, defaultValue?: string): string => {
  const value = process.env[variable] ?? defaultValue;

  if (!value) {
    throw new TypeError(`Required environment variable ${variable} is undefined and has no default`);
  }

  return value;
};

const envNumber = (variable: keyof Environment, defaultValue?: number): number => {
  const value = Number(process.env[variable]) ?? defaultValue;

  if (!value) {
    throw new TypeError(`Required environment variable ${variable} is undefined and has no default`);
  }

  return value;
};

export { loadEnvs, environment, envString, envNumber };
