export enum DatabaseMapperType {
  KNEX_OBJECTION = 'knex_objection',
}

export interface DatabaseConfig {
  client: 'pg'
  connection: string;
}