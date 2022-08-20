import { Model, RelationMappings } from 'objection';
import * as path from 'path';

export class Follower extends Model {
  id!: number;
  userId!: number;
  followedUserId!: number;
  createdAt: string;
  updatedAt: string;

  static override tableName: string = 'followers';
  static override idColumn: string | string[] = 'id';

  static override get relationMappings(): RelationMappings {    
    return {
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'followers.userId',
          to: 'users.id',
        },
      },
    };
  }

  override $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  override $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
