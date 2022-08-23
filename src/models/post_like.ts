import { Model, RelationMappings } from 'objection';
import { PostLike as IPostLike } from '../interfaces/post';
import * as path from 'path';

export class PostLike extends Model implements IPostLike {
  id!: number;
  postId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;

  static override tableName: string = 'post_likes';
  static override idColumn: string | string[] = 'id';

  static override get relationMappings(): RelationMappings {
    return {
      postLikeUsers: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User'),
        join: {
          from: 'post_likes.userId',
          to: 'users.id',
        },
      },
      likes: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Post'),
        join: {
          from: 'post_likes.postId',
          to: 'posts.id',
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
