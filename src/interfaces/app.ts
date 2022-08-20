import type { Logger } from '../tools/logger';
import type { Application, NextFunction, Request, RequestHandler, Response, Router } from 'express';
import type { Knex } from 'knex';
import type { RoutingDependencies } from '../routes';
import type { Celebrator2 } from 'celebrate';
import type { AppendArgument } from '../utils/types';
import type { Application as ServerApplication, ApplicationType } from '../factories/application/application.types';
import type { Database, DatabaseMapperType } from '../factories/database/database.types';
import type { DatabaseConfig } from './database';
import type { UserRepository } from '../repositories/user.repository';
import type { UserActivationConfig } from '../config/app';
import type { ApplicationFactory } from '../factories/application/application.factory';
import type { DatabaseFactory } from '../factories/database/database.factory';
import type { AuthenticationClientFactory } from '../factories/authentication/authentication-client.factory';
import type { AuthenticationStrategy, TokenConfig } from '../factories/authentication/authentication-client.types';
import type { UserHandlers } from '../controllers';
import type { ProfileRepository } from '../repositories/profile.repository';
import type { ProfileHandlers } from '../controllers/profiles';
import type { SchedulerEnvironmentConfig } from './scheduler';

export type MiddlewareType<T> = (req: Request, res: Response, next: NextFunction) => T;
export type ErrorMiddlewareType<T> = AppendArgument<MiddlewareType<T>, Error>;
export type Controller<R extends string> = {
  [Key in R]: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
};
export type ValidationSchema<R extends string> = {
  [Key in R]: RequestHandler;
};

export interface AppConfig {
  appName: string;
  appType: ApplicationType;
  authenticationStrategy: AuthenticationStrategy;
  databaseMapper: DatabaseMapperType;
  port: number;
  env: string;
  passwordRegex: RegExp;
  passwordValidationError: string;
  saltRounds: number;
  userActivationConfig: UserActivationConfig;
  accessTokenConfig: TokenConfig;
  refreshTokenConfig: TokenConfig;
  apiKey: string;
  apiKeyRegex: RegExp;
  apiKeyHeaderName: string;
  redisUrl: string;
  schedulerConfig: SchedulerEnvironmentConfig;
}

export interface AppDependencies {
  app: Application;
  server: ServerApplication;
}

export interface DatabaseDependencies<T = Knex> {
  db: Database<T>;
  dbConfig: DatabaseConfig;
  usersRepository: UserRepository;
  profilesRepository: ProfileRepository;
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
  applicationFactory: ApplicationFactory;
  databaseFactory: DatabaseFactory;
  authenticationFactory: AuthenticationClientFactory;
}

export interface ValidationSchemaDependencies {
  usersValidation: ValidationSchema<UserHandlers>;
  profilesValidation: ValidationSchema<ProfileHandlers>;
}

export interface MiddlewareDependencies {
  requireAccessHandler: MiddlewareType<Promise<void>>;
  apiKeyHandler: MiddlewareType<void>;
  errorHandler: ErrorMiddlewareType<Response>;
  featureDisabledHandler: MiddlewareType<void>;
}
