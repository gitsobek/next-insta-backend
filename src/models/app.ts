import { Logger } from '../tools/logger';
import { Application, NextFunction, Request, Response, Router } from 'express';
import { Knex } from 'knex';
import { RoutingDependencies } from '../routes';
import { Celebrator2 } from 'celebrate';
import { AppendArgument } from '../tools/types';
import { Server } from 'http';

export type MiddlewareType<T> = (req: Request, res: Response, next: NextFunction) => T;
export type ErrorMiddlewareType<T> = AppendArgument<MiddlewareType<T>, Error>;

export interface AppConfig {
  appName: string;
  port: number;
  env: string;
}

export interface AppDependencies {
  app: Application;
  server: Server;
}

export interface DatabaseDependencies {
  db: Knex;
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
