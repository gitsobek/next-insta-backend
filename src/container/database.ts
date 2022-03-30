import { asFunction, asValue, type AwilixContainer } from 'awilix';
import { dbConfig } from '../config/db';
import type { DatabaseFactory } from '../factories/database/database.factory';
import type { AppConfig, DatabaseDependencies } from '../interfaces/app';

export function registerDatabase(
  container: AwilixContainer,
  appConfig: AppConfig,
): AwilixContainer<DatabaseDependencies> {
  const databaseFactory: DatabaseFactory = container.resolve('databaseFactory');
  const dbBuilder = databaseFactory.getDatabaseBuilder(appConfig.databaseMapper);

  container.register({
    dbConfig: asValue(dbConfig),
    db: asFunction(dbBuilder).singleton(),
  });

  return container;
}
