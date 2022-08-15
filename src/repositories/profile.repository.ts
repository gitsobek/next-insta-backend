import type { Pagination } from '../interfaces/pagination';
import type { Follower, Story } from '../interfaces/profile';
import type { User } from '../interfaces/user';

export interface ProfileRepository {
  getStories: (id: number) => Promise<Story[]>;
  getFollowers: (id: number, queryObject?: Pagination) => Promise<[User[], number]>;
  getFollowingUsers: (id: number, queryObject?: Pagination) => Promise<[User[], number]>;
  follows: (visitorId: number, checkedUserId: number) => Promise<boolean>;
  follow: (visitorId: number, targetId: number) => Promise<Follower>;
  unfollow: (visitorId: number, targetId: number) => Promise<number>;
}
