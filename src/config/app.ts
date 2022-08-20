import { Joi } from 'celebrate';
import { flow } from 'fp-ts/lib/function';
import { environment, envNumber, envString, loadEnvs } from './env';
import { type AppConfig } from '../interfaces/app';
import { ApplicationType } from '../factories/application/application.types';
import { AuthenticationStrategy } from '../factories/authentication/authentication-client.types';
import { DatabaseMapperType } from '../factories/database/database.types';

loadEnvs();

export interface UserActivationConfig {
  isUserActivationNeeded: boolean;
  timeToActiveAccountInDays: number;
};

const apiKeyRegex = new RegExp(
  process.env.API_KEY_REGEX || '[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}',
);
const passwordRegex = new RegExp(process.env.PASSWORD_REGEX || '^.{6,24}$');

const loadConfig = (): AppConfig => ({
  appName: envString('SERVER_NAME', 'next_insta_api'),
  appType: ApplicationType.HTTP,
  authenticationStrategy: (process.env.AUTHENTICATION_STRATEGY ||
    AuthenticationStrategy.CUSTOM_JWT_V1) as AuthenticationStrategy,
  databaseMapper: DatabaseMapperType.KNEX_OBJECTION,
  port: envNumber('SERVER_PORT', 1337),
  env: environment(),
  passwordRegex,
  passwordValidationError: process.env.PASSWORD_VALIDATION_ERROR || 'Password must be at least 6 to 24 characters.',
  saltRounds: +(process.env.SALT_ROUNDS || 6),
  userActivationConfig: {
    isUserActivationNeeded: (process.env.IS_USER_ACTIVATION_NEEDED || 'false') === 'true',
    timeToActiveAccountInDays: +(process.env.TIME_TO_ACTIVE_ACCOUNT_IN_DAYS || 3),
  },
  accessTokenConfig: {
    expirationInSeconds: +(process.env.ACCESS_TOKEN_EXPIRATION || 600),
    secret: process.env.ACCESS_TOKEN_SECRET || 'kTNZh3bJRp',
  },
  refreshTokenConfig: {
    expirationInSeconds: +(process.env.REFRESH_TOKEN_EXPIRATION || 900),
    secret: process.env.REFRESH_TOKEN_SECRET || 'qUaLLSCSp8',
  },
  apiKey: process.env.API_KEY as string,
  apiKeyRegex,
  apiKeyHeaderName: process.env.API_KEY_HEADER_NAME || 'x-api-key',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  schedulerConfig: {
    queueName: process.env.JOB_QUEUE_NAME || 'next-insta-queue',
    attempts: +(process.env.JOB_ATTEMPTS_NUMBER || 3),
    timeBetweenAttempts: +(process.env.JOB_TIME_BETWEEN_ATTEMPTS || 5000),
  },
});

const validateConfig = (config: AppConfig): AppConfig | never => {
  const tokenConfigSchema = Joi.object({
    expirationInSeconds: Joi.number().positive().required(),
    secret: Joi.string().required(),
  });

  const schema = Joi.object<AppConfig>().keys({
    appName: Joi.string().required(),
    appType: Joi.string().valid('http').required(),
    authenticationStrategy: Joi.string()
      .valid(...Object.values(AuthenticationStrategy))
      .required(),
    databaseMapper: Joi.string().valid('knex_objection').required(),
    port: Joi.number().required(),
    env: Joi.string().required(),
    passwordRegex: Joi.object().instance(RegExp).required(),
    passwordValidationError: Joi.string().required(),
    saltRounds: Joi.number().required(),
    userActivationConfig: Joi.object({
      isUserActivationNeeded: Joi.boolean().required(),
      timeToActiveAccountInDays: Joi.number().required(),
    }).required(),
    accessTokenConfig: tokenConfigSchema.required(),
    refreshTokenConfig: tokenConfigSchema.required(),
    apiKey: Joi.string().regex(config.apiKeyRegex).required(),
    apiKeyRegex: Joi.object().instance(RegExp).required(),
    apiKeyHeaderName: Joi.string().required(),
    redisUrl: Joi.string().required(),
    schedulerConfig: Joi.object({
      queueName: Joi.string().required(),
      attempts: Joi.number().min(0).required(),
      timeBetweenAttempts: Joi.number().min(0).required(),
    }).required(),
  });

  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const appConfig = flow(loadConfig, validateConfig)();
