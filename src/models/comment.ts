import * as path from 'path';
import { Model } from 'objection';
import type { Comment as IComment } from '../interfaces/comment';

export class Comment extends Model implements IComment {
  id!: number;
  text: string;
  postId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;

  static override tableName: string = 'comments';
  static override idColumn: string | string[] = 'id';

  static override relationMappings = {
    commentAuthor: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'user'),
      join: {
        from: 'comments.userId',
        to: 'users.id',
      },
    },
    commentPost: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'post'),
      join: {
        from: 'comments.postId',
        to: 'posts.id',
      },
    },
    commentLikes: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'comment_like'),
      join: {
        from: 'comments.id',
        to: 'comment_likes.commentId',
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
