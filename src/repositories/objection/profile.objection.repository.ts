import { Model, raw } from 'objection';
import { User as UserTable } from '../../models/user';
import { Story as StoryTable } from '../../models/story';
import { Follower as FollowerTable } from '../../models/follower';
import type { ProfileRepository } from '../profile.repository';
import type { User } from '../../interfaces/user';
import type { Pagination } from '../../interfaces/pagination';
import type { DatabasePeriod } from '../../interfaces/database';
import type { Follower, Profile, Story } from '../../interfaces/profile';

export class ProfileObjectionRepository implements ProfileRepository {
  public async getProfile(username: string, authenticatedUserId: number): Promise<Profile | null> {
    return UserTable.query()
      .select('id')
      .where('username', '=', username)
      .first()
      .then((user) => {
        if (!user) {
          return null;
        }

        return UserTable.query()
          .select([
            'users.id',
            'users.username',
            'users.firstName',
            'users.lastName',
            'users.bio',
            'users.avatar as avatarUrl',
            raw(
              'cast(coalesce(?, 0) as INTEGER) as posts',
              UserTable.relatedQuery('posts').count().where('userId', '=', user.id),
            ),
            raw(
              'cast(coalesce(?, 0) as INTEGER) as followers',
              FollowerTable.query()
                .count()
                .innerJoin('users', 'users.id', 'followers.userId')
                .where('followedUserId', '=', user.id),
            ),
            raw(
              'cast(coalesce(?, 0) as INTEGER) as following',
              FollowerTable.query()
                .count()
                .innerJoin('users', 'users.id', 'followers.followedUserId')
                .where('userId', '=', user.id),
            ),
            raw(
              '(select exists ?) as isFollowing',
              FollowerTable.query().count().where({
                userId: authenticatedUserId,
                followedUserId: user.id,
              }),
            ),
            raw(
              "(select coalesce(json_agg(row_to_json(storiesRow)), '[]'::json) as stories FROM (?) storiesRow)",
              StoryTable.query()
                .select('id', 'photoUrl', 'createdAt')
                .where('stories.userId', '=', user.id)
                .orderBy('stories.createdAt', 'ASC'),
            ),
          ])
          .where('users.id', '=', user.id)
          .first();
      }) as unknown as Promise<Profile | null>;
  }

  public async addStory(id: number, story: Story): Promise<Story> {
    return StoryTable.query().insertAndFetch({
      userId: id,
      photoUrl: story.photoUrl,
    });
  }

  public async getStories(id: number): Promise<Story[]> {
    return StoryTable.query()
      .select('id', 'photoUrl', 'createdAt')
      .where('userId', '=', id)
      .orderBy('createdAt', 'ASC');
  }

  public async deleteStory(id: number, userId: number): Promise<number> {
    return StoryTable.query().delete().where({ id, userId });
  }

  public async deleteStoryOlderThanPeriod(period: DatabasePeriod): Promise<number> {
    return StoryTable.query()
      .delete()
      .whereRaw(`stories."createdAt" < NOW() - INTERVAL '${period}'`);
  }

  public async getFollowers(id: number, queryObject?: Pagination): Promise<[User[], number]> {
    const initialQuery = UserTable.query()
      .select(
        [
          'users.id',
          'users.username',
          'users.firstName',
          'users.lastName',
          'users.avatar as avatarUrl',
        ],
        raw('f.stories'),
      )
      .innerJoin(
        Model.query()
          .select(
            'fT.id',
            raw(
              "COALESCE(json_agg(stories) FILTER (WHERE stories.id IS NOT NULL), '[]') as stories",
            ),
          )
          .from(
            FollowerTable.query()
              .select('users.id')
              .innerJoin('users', 'users.id', 'followers.userId')
              .where('followedUserId', '=', id)
              .as('fT'),
          )
          .as('f')
          .leftJoin('stories', 'fT.id', 'stories.userId')
          .groupBy('fT.id'),
        'users.id',
        'f.id',
      );

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

  public async getFollowingUsers(id: number, queryObject?: Pagination): Promise<[User[], number]> {
    const initialQuery = UserTable.query()
      .select(
        [
          'users.id',
          'users.username',
          'users.firstName',
          'users.lastName',
          'users.avatar as avatarUrl',
        ],
        raw('f.stories'),
      )
      .innerJoin(
        Model.query()
          .select(
            'fT.id',
            raw(
              "COALESCE(json_agg(stories) FILTER (WHERE stories.id IS NOT NULL), '[]') as stories",
            ),
          )
          .from(
            FollowerTable.query()
              .select('users.id')
              .innerJoin('users', 'users.id', 'followers.followedUserId')
              .where('followers.userId', '=', id)
              .as('fT'),
          )
          .as('f')
          .leftJoin('stories', 'fT.id', 'stories.userId')
          .groupBy('fT.id'),
        'users.id',
        'f.id',
      );

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

  public async follows(visitorId: number, checkedUserId: number): Promise<boolean> {
    return FollowerTable.query()
      .select()
      .where({
        userId: visitorId,
        followedUserId: checkedUserId,
      })
      .context({
        runAfter(result: Follower[]) {
          return !!result.length;
        },
      }) as unknown as Promise<boolean>;
  }

  public async follow(visitorId: number, targetId: number): Promise<Follower> {
    return FollowerTable.query().insertAndFetch({
      userId: visitorId,
      followedUserId: targetId,
    });
  }

  public async unfollow(visitorId: number, targetId: number): Promise<number> {
    return FollowerTable.query().delete().where({
      userId: visitorId,
      followedUserId: targetId,
    });
  }
}
