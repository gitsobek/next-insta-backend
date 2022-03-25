import { Joi } from 'celebrate';
import { EnvironmentTypes, envNumber, envString, loadEnvs } from './env';
import { flow } from 'fp-ts/lib/function';
import { Knex } from 'knex';

loadEnvs();

const buildConnectionUrl = (): string =>
  `postgresql://${envString('DB_USERNAME', 'user')}:${envString('DB_PASSWORD', 'password')}@${envString(
    'DB_HOSTNAME',
    'localhost',
  )}:${envNumber('DB_PORT', 5432)}/${envString('DB_NAME', 'next-insta-db')}`;

const createDatabaseConfig = (): Record<EnvironmentTypes, Knex.Config> => ({
  development: {
    client: 'pg',
    connection: buildConnectionUrl(),
    migrations: {
      directory: '../database/migrations',
    },
    seeds: { directory: '../database/seeds' },
  },
  test: {
    client: 'pg',
    connection: buildConnectionUrl(),
    migrations: {
      directory: '../database/migrations',
    },
    seeds: { directory: '../database/seeds' },
  },
  production: {
    client: 'pg',
    connection: buildConnectionUrl(),
    migrations: {
      directory: '../database/migrations',
    },
    seeds: { directory: '../database/seeds' },
  },
});

const pickDatabaseConfig = (config: Record<EnvironmentTypes, Knex.Config>) =>
  config[process.env.NODE_ENV as EnvironmentTypes];

const validateDatabaseConfig = (
  config: Record<EnvironmentTypes, Knex.Config>,
): Record<EnvironmentTypes, Knex.Config> | never => {
  const subSchema = {
    client: Joi.string().required(),
    connection: Joi.string().required(),
    migrations: Joi.object().keys({
      directory: Joi.string().required(),
    }),
    seeds: Joi.object().keys({
      directory: Joi.string().required(),
    }),
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
