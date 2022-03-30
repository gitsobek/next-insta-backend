import { Joi } from 'celebrate';
import { EnvironmentTypes, envNumber, envString, loadEnvs } from './env';
import { flow } from 'fp-ts/lib/function';
import type { DatabaseConfig } from '../interfaces/database';

loadEnvs();

const buildConnectionUrl = (): string =>
  `postgresql://${envString('DB_USERNAME', 'user')}:${envString('DB_PASSWORD', 'password')}@${envString(
    'DB_HOSTNAME',
    'localhost',
  )}:${envNumber('DB_PORT', 5432)}/${envString('DB_NAME', 'next-insta-db')}`;

const createDatabaseConfig = (): Record<EnvironmentTypes, DatabaseConfig> => ({
  development: {
    client: 'pg',
    connection: buildConnectionUrl(),
  },
  test: {
    client: 'pg',
    connection: buildConnectionUrl(),
  },
  production: {
    client: 'pg',
    connection: buildConnectionUrl(),
  },
});

const pickDatabaseConfig = (config: Record<EnvironmentTypes, DatabaseConfig>) =>
  config[process.env.NODE_ENV as EnvironmentTypes];

const validateDatabaseConfig = (
  config: Record<EnvironmentTypes, DatabaseConfig>,
): Record<EnvironmentTypes, DatabaseConfig> | never => {
  const subSchema = {
    client: Joi.string().required(),
    connection: Joi.string().required(),
  };

  const schema = Joi.object().keys({
    development: Joi.object().keys(subSchema),
    test: Joi.object().keys(subSchema),
    production: Joi.object().keys(subSchema),
  });

  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const dbConfig = flow(createDatabaseConfig, validateDatabaseConfig, pickDatabaseConfig)();
