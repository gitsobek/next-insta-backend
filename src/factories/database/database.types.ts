import { DatabaseConfig } from "../../interfaces/database";

export enum DatabaseMapperType {
  KNEX_OBJECTION = 'knex_objection',
}

export interface Database<T> {
  readonly mapper: T;
  configure: (config: DatabaseConfig) => T
  connect: () => Promise<void>;
}
