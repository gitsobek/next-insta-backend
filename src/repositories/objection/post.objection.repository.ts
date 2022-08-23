import type { PostRepository } from '../post.repository';
import type { Post, PostLike } from '../../interfaces/post';
import type { Pagination } from '../../interfaces/pagination';
import type { User } from '../../interfaces/user';
import { Post as PostTable } from '../../models/post';
import { PostLike as PostLikeTable } from '../../models/post_like';
import { raw } from 'objection';

export class PostObjectionRepository implements PostRepository {
  public async addPost(id: number, post: Post): Promise<Post> {
    return PostTable.query().insertAndFetch({
      ...post,
      userId: id,
    });
  }

  public async findPostById(id: number): Promise<Post | undefined> {
    return PostTable.query()
      .select([
        'posts.*',
        PostTable.relatedQuery('postLikes')
          .count()
          .as('likes')
          .where('postLikes.postId', '=', id)
          .groupBy('postLikes.postId'),
      ])
      .where('posts.id', '=', id)
      .first();
  }

  public async getPosts(id: number, queryObject?: Pagination): Promise<[Post[], number]> {
    const initialQuery = PostTable.query()
      .select('posts.*', raw('cast(coalesce(grouped_likes.count, 0) as INTEGER) as likes'))
      .leftJoin(
        PostLikeTable.query().select('postId').count().groupBy('postId').as('grouped_likes'),
        'posts.id',
        'grouped_likes.postId',
      )
      .where('posts.userId', '=', id);

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

    return Promise.all([query, initialQuery.resultSize()] as unknown as [Post[], number]);
  }

  public async deletePost(id: number): Promise<Post> {
    return PostTable.query().deleteById(id).returning('*') as unknown as Post;
  }

  public async getLikes(id: number, queryObject?: Pagination): Promise<[User[], number]> {
    const initialQuery = PostLikeTable.query()
      .innerJoin('users', 'users.id', 'post_likes.userId')
      .columns('users.*')
      .where('postId', '=', id);

    const query = initialQuery.clone();

    if (queryObject) {
      if (queryObject.filter) {
        for (let [k, v] of Object.entries(queryObject.filter)) {
          query.where(`users.${k}`, 'LIKE', `%${v}%`);
        }
      }

      query
        .orderBy(queryObject.order.by, queryObject.order.type)
        .offset((queryObject.page - 1) * queryObject.limit)
        .limit(queryObject.limit);
    }

    return Promise.all([query, initialQuery.resultSize()] as unknown as [User[], number]);
  }

  public async likes(visitorId: number, checkedPostId: number): Promise<boolean> {
    return PostLikeTable.query()
      .select()
      .where({
        postId: checkedPostId,
        userId: visitorId,
      })
      .context({
        runAfter(result: PostLike[]) {
          return !!result.length;
        },
      }) as unknown as Promise<boolean>;
  }

  public async like(visitorId: number, postId: number): Promise<PostLike> {
    return PostLikeTable.query().insertAndFetch({
      postId,
      userId: visitorId,
    });
  }

  public async unlike(visitorId: number, postId: number): Promise<number> {
    return PostLikeTable.query().delete().where({
      postId,
      userId: visitorId,
    });
  }
}
