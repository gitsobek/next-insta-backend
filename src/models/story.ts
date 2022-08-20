import { Model } from 'objection';
import type { Story as IStory } from '../interfaces/profile';
import * as path from 'path';

export class Story extends Model implements IStory {
  id!: number;
  userId!: number;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;

  static override tableName: string = 'stories';
  static override idColumn: string | string[] = 'id';

  static override relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'stories.userId',
        to: 'users.id',
      },
    },
  };

  override $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  override $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
