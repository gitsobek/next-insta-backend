import type { Logger } from '../tools/logger';
import type { Application, NextFunction, Request, Response, Router } from 'express';
import type { Knex } from 'knex';
import type { RoutingDependencies } from '../routes';
import type { Celebrator2 } from 'celebrate';
import type { AppendArgument } from '../tools/types';
import type { Application as ServerApplication } from '../factories/application/application.types';
import type { Database } from '../factories/database/database.types';
import type { DatabaseConfig, DatabaseMapperType } from './database';

export type MiddlewareType<T> = (req: Request, res: Response, next: NextFunction) => T;
export type ErrorMiddlewareType<T> = AppendArgument<MiddlewareType<T>, Error>;
export type Controller<R> = {
  [Key in keyof R]: (req: Request, res: Response, next: NextFunction) => Promise<Response>
};

export enum ApplicationType {
  HTTP = 'http'
}

export interface AppConfig {
  appName: string;
  appType: ApplicationType;
  databaseMapper: DatabaseMapperType
  port: number;
  env: string;
}

export interface AppDependencies {
  app: Application;
  server: ServerApplication;
}

export interface DatabaseDependencies<T = Knex> {
  db: Database<T>;
  dbConfig: DatabaseConfig;
}

export interface ConfigDependencies {
  connection: Knex;
  appConfig: AppConfig;
}

export interface CommonDependencies {
  port: number;
  appConfig: AppConfig;
  router: (routes: RoutingDependencies) => Router;
  logger: Logger;
  validator: Celebrator2;
  hideDetailsFromProduction: (val: string) => string | undefined;
}

export interface MiddlewareDependencies {
  errorHandler: ErrorMiddlewareType<Response>;
}
