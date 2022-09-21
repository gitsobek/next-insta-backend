import { asClass, asFunction, asValue, type AwilixContainer } from 'awilix';
import { dbConfig } from '../config/db';
import type { DatabaseFactory } from '../factories/database/database.factory';
import { DatabaseMapperType } from '../factories/database/database.types';
import type { AppConfig, DatabaseDependencies } from '../interfaces/app';
import { CommentObjectionRepository } from '../repositories/objection/comment.objection.repository';
import { PostObjectionRepository } from '../repositories/objection/post.objection.repository';
import { ProfileObjectionRepository } from '../repositories/objection/profile.objection.repository';
import { UserObjectionRepository } from '../repositories/objection/user.objection.repository';

function getRepositories(mapper: DatabaseMapperType) {
  switch (mapper) {
    case DatabaseMapperType.KNEX_OBJECTION: {
      const usersRepository = asClass(UserObjectionRepository).singleton();
      const profilesRepository = asClass(ProfileObjectionRepository).singleton();
      const postsRepository = asClass(PostObjectionRepository).singleton();
      const commentsRepository = asClass(CommentObjectionRepository).singleton();
      return { usersRepository, profilesRepository, postsRepository, commentsRepository };
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

  const { usersRepository, profilesRepository, postsRepository, commentsRepository } =
    getRepositories(appConfig.databaseMapper);

  container.register({
    dbConfig: asValue(dbConfig),
    db: asFunction(dbBuilder).singleton(),
    usersRepository,
    profilesRepository,
    postsRepository,
    commentsRepository,
  });

  return container;
}
