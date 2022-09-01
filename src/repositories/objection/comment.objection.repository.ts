import { raw } from 'objection';
import { User as UserTable } from '../../models/user';
import { Comment as CommentTable } from '../../models/comment';
import { CommentLike as CommentLikeTable } from '../../models/comment_like';
import type { Pagination } from '../../interfaces/pagination';
import type { Comment, CommentLike } from '../../interfaces/comment';
import type { CommentRepository } from '../comment.repository';
import type { CommentPayload } from '../../interfaces/comment';

export class CommentObjectionRepository implements CommentRepository {
  public async addComment(
    postId: number,
    userId: number,
    commentPayload: CommentPayload,
  ): Promise<Comment> {
    return CommentTable.query().insertAndFetch({
      ...commentPayload,
      postId,
      userId,
    });
  }

  public async findCommentById(id: number): Promise<Comment | undefined> {
    return CommentTable.query()
      .select([
        'comments.*',
        CommentTable.relatedQuery('commentLikes')
          .count()
          .as('likes')
          .where('commentLikes.commentId', '=', id)
          .groupBy('commentLikes.commentId'),
      ])
      .where('comments.id', '=', id)
      .first();
  }

  public async getComments(
    postId: number,
    queryObject?: Pagination,
    userId?: number,
  ): Promise<[Comment[], number]> {
    const initialQuery = CommentTable.query()
      .select(
        'comments.*',
        raw('cast(coalesce(grouped_likes.count, 0) as INTEGER) as likes'),
        raw('row_to_json(u) as user'),
        raw('cast(coalesce(liked_by_sender.id, 0) as BOOLEAN)').as('isLiking'),
      )
      .leftJoin(
        CommentLikeTable.query()
          .as('liked_by_sender')
          .where('userId', '=', userId || null),
        'comments.id',
        'liked_by_sender.commentId',
      )
      .leftJoin(
        CommentLikeTable.query()
          .select('commentId')
          .count()
          .groupBy('commentId')
          .as('grouped_likes'),
        'comments.id',
        'grouped_likes.commentId',
      )
      .leftJoin(
        UserTable.query()
          .select([
            'users.id',
            'users.username',
            'users.firstName',
            'users.lastName',
            'users.avatar as avatarUrl',
          ])
          .as('u'),
        'comments.userId',
        'u.id',
      )
      .where('comments.postId', '=', postId);

    const query = initialQuery.clone();

    if (queryObject) {
      if (queryObject.filter) {
        for (let [k, v] of Object.entries(queryObject.filter)) {
          query.where(`${k}`, 'LIKE', `%${v}%`);
        }
      }

      if (queryObject.order) {
        query.orderBy(queryObject.order.by, queryObject.order.type);
      }

      if (queryObject.page && queryObject.limit) {
        query.offset((queryObject.page - 1) * queryObject.limit).limit(queryObject.limit);
      }
    }

    return Promise.all([query, initialQuery.resultSize()] as unknown as [Comment[], number]);
  }

  public async deleteComment(id: number, userId: number): Promise<number> {
    return CommentTable.query().delete().where({ id, userId });
  }

  public async likes(commentId: number, visitorId: number): Promise<boolean> {
    return CommentLikeTable.query()
      .select()
      .where({
        commentId: commentId,
        userId: visitorId,
      })
      .context({
        runAfter(result: CommentLike[]) {
          return !!result.length;
        },
      }) as unknown as Promise<boolean>;
  }

  public async like(commentId: number, visitorId: number): Promise<CommentLike> {
    return CommentLikeTable.query().insertAndFetch({
      commentId,
      userId: visitorId,
    });
  }

  public async unlike(commentId: number, visitorId: number): Promise<number> {
    return CommentLikeTable.query().delete().where({
      commentId,
      userId: visitorId,
    });
  }
}
