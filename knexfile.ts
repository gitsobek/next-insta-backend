import { dbConfig } from './src/config/db';
import type { Knex } from 'knex';
import type { EnvironmentTypes } from './src/config/env';

const config: Record<EnvironmentTypes, Knex.Config> = {
  development: {
    client: dbConfig.client,
    connection: dbConfig.connection,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: { directory: './src/database/seeds' },
  },
  test: {
    client: dbConfig.client,
    connection: dbConfig.connection,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: { directory: './src/database/seeds' },
  },
  production: {
    client: dbConfig.client,
    connection: dbConfig.connection,
    migrations: {
      directory: './src/database/migrations',
    },
    seeds: { directory: './src/database/seeds' },
  },
};

module.exports = config;
