import type { DatabaseDependencies } from '../../../interfaces/app';
import { KnexObjectionDatabase } from './knex-objection-database';

export const createKnexObjectionDatabase = (dependencies: DatabaseDependencies) => {
  return new KnexObjectionDatabase({ config: dependencies.dbConfig });
};
