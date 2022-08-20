import type { Follower, Story } from '../../interfaces/profile';
import { Story as StoryTable } from '../../models/story';
import { Follower as FollowerTable } from '../../models/follower';
import type { ProfileRepository } from '../profile.repository';
import type { User } from '../../interfaces/user';
import type { Pagination } from '../../interfaces/pagination';
import type { DatabasePeriod } from '../../interfaces/database';

export class ProfileObjectionRepository implements ProfileRepository {
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

  public async deleteStory(id: number): Promise<Story> {
    return StoryTable.query().deleteById(id).returning('*') as unknown as Story;
  }

  public async deleteStoryOlderThanPeriod(period: DatabasePeriod): Promise<number> {
    return StoryTable.query().delete().whereRaw(`stories."createdAt" < NOW() - INTERVAL '${period}'`);
  }

  public async getFollowers(id: number, queryObject?: Pagination): Promise<[User[], number]> {
    const initialQuery = FollowerTable.query()
      .innerJoin('users', 'users.id', 'followers.userId')
      .columns('users.*')
      .where('followedUserId', '=', id);

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
    const initialQuery = FollowerTable.query()
      .innerJoin('users', 'users.id', 'followers.followedUserId')
      .columns('users.*')
      .where('userId', '=', id);

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
