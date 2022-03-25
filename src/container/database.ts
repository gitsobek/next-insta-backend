import { asValue, AwilixContainer } from 'awilix';
import Knex from 'knex';
import { dbConfig } from '../config/db';
import { ConfigDependencies } from '../models/app';

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
