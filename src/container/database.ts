import { asValue, type AwilixContainer } from 'awilix';
import Knex from 'knex';
import { dbConfig } from '../config/db';
import type { ConfigDependencies } from '../interfaces/app';

export function registerDatabase(
  container: AwilixContainer,
  dependencies?: Partial<ConfigDependencies>,
): AwilixContainer {
  const dbConnection = dependencies?.connection || Knex(dbConfig);

  container.register({
    db: asValue(dbConnection),
  });

  return container;
}
