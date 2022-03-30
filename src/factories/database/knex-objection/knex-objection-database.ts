import Knex from 'knex';
import type { Knex as IKnex } from 'knex';
import type { Database } from '../database.types';
import { Model } from 'objection';
import type { DatabaseConfig } from '../../../interfaces/database';

export interface DatabaseProps {
  config: DatabaseConfig;
}

export class KnexObjectionDatabase implements Database<IKnex> {
  private ormMapper: IKnex;

  constructor(readonly dependencies: DatabaseProps) {
    this.ormMapper = this.configure(dependencies.config);
  }

  get mapper(): IKnex {
    return this.ormMapper;
  }

  public configure(config: DatabaseConfig): IKnex {
    return Knex(config);
  }

  public connect(): Promise<void> {
    Model.knex(this.ormMapper);
    return this.ormMapper.raw('SELECT 1');
  }
}
