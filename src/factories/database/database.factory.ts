import { DatabaseMapperType } from '../../interfaces/database';
import { createKnexObjectionDatabase } from './knex-objection/create-knex-objection';

export class DatabaseFactory {
  public getDatabaseBuilder(type: DatabaseMapperType) {
    if (type === DatabaseMapperType.KNEX_OBJECTION) {
      return createKnexObjectionDatabase;
    }

    throw new Error(`Database type ${type} not supported. Cannot start the service.`);
  }
}
