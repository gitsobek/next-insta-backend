import { Joi } from 'celebrate';
import { flow } from 'fp-ts/lib/function';
import { environment, envNumber, envString, loadEnvs } from './env';
import { type AppConfig, ApplicationType } from '../interfaces/app';
import { DatabaseMapperType } from '../interfaces/database';

loadEnvs();

export type UserActivationConfig = {
  isUserActivationNeeded: boolean;
  timeToActiveAccountInDays: number;
};

const passwordRegex = new RegExp(process.env.PASSWORD_REGEX || '^.{6,24}$');

const loadConfig = (): AppConfig => ({
  appName: envString('SERVER_NAME', 'next_insta_api'),
  appType: ApplicationType.HTTP,
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
});

const validateConfig = (config: AppConfig): AppConfig | never => {
  const schema = Joi.object<AppConfig>().keys({
    appName: Joi.string().required(),
    appType: Joi.string().valid('http').required(),
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
  });
  
  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const appConfig = flow(loadConfig, validateConfig)();
