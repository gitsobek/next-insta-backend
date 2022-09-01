import * as path from 'path';
import { Model, RelationMappings } from 'objection';
import { Follower as IFollower } from '../interfaces/profile';

export class Follower extends Model implements IFollower {
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
        modelClass: path.join(__dirname, 'user'),
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
