import * as path from 'path';
import { Model } from 'objection';
import { Post as IPost } from '../interfaces/post';

export class Post extends Model implements IPost {
  id!: number;
  photoUrl: string;
  description: string;
  location: string;
  userId: number;
  createdAt: string;
  updatedAt: string;

  static override tableName: string = 'posts';
  static override idColumn: string | string[] = 'id';

  static override relationMappings = {
    postAuthor: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'posts.userId',
        to: 'users.id',
      },
    },
    postLikes: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'post_like'),
      join: {
        from: 'posts.id',
        to: 'post_likes.postId',
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
