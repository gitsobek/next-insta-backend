import * as path from 'path';
import { Model, RelationMappings } from 'objection';
import { CommentLike as ICommentLike } from '../interfaces/comment';

export class CommentLike extends Model implements ICommentLike {
  id!: number;
  commentId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;

  static override tableName: string = 'comment_likes';
  static override idColumn: string | string[] = 'id';

  static override get relationMappings(): RelationMappings {
    return {
      commentLikeUsers: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'user'),
        join: {
          from: 'comment_likes.userId',
          to: 'users.id',
        },
      },
      commentLikeLikes: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'comment'),
        join: {
          from: 'comment_likes.commentId',
          to: 'comments.id',
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
