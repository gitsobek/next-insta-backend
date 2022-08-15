import { asClass, asFunction, asValue, type AwilixContainer } from 'awilix';
import { dbConfig } from '../config/db';
import type { DatabaseFactory } from '../factories/database/database.factory';
import { DatabaseMapperType } from '../factories/database/database.types';
import type { AppConfig, DatabaseDependencies } from '../interfaces/app';
import { ProfileObjectionRepository } from '../repositories/objection/profile.objection.repository';
import { UserObjectionRepository } from '../repositories/objection/user.objection.repository';

function getRepositories(mapper: DatabaseMapperType) {
  switch (mapper) {
    case DatabaseMapperType.KNEX_OBJECTION: {
      const usersRepository = asClass(UserObjectionRepository).singleton();
      const profilesRepository = asClass(ProfileObjectionRepository).singleton();
      return { usersRepository, profilesRepository };
    }
    default:
      throw new Error(`Mapper '${mapper}' is not supported.`);
  }
}

export function registerDatabase(
  container: AwilixContainer,
  appConfig: AppConfig,
): AwilixContainer<DatabaseDependencies> {
  const databaseFactory: DatabaseFactory = container.resolve('databaseFactory');
  const dbBuilder = databaseFactory.getDatabaseBuilder(appConfig.databaseMapper);

  const { usersRepository, profilesRepository } = getRepositories(appConfig.databaseMapper);

  container.register({
    dbConfig: asValue(dbConfig),
    db: asFunction(dbBuilder).singleton(),
    usersRepository,
    profilesRepository,
  });

  return container;
}
