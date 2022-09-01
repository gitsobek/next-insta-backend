import type { DatabasePeriod } from '../interfaces/database';
import type { Pagination } from '../interfaces/pagination';
import type { Follower, Profile, Story } from '../interfaces/profile';
import type { User } from '../interfaces/user';

export interface ProfileRepository {
  getProfile: (username: string, targetId: number) => Promise<Profile | null>;
  addStory: (userId: number, story: Story) => Promise<Story>;
  getStories: (id: number) => Promise<Story[]>;
  deleteStory: (id: number, userId: number) => Promise<number>;
  deleteStoryOlderThanPeriod: (period: DatabasePeriod) => Promise<number>;
  getFollowers: (id: number, queryObject?: Pagination) => Promise<[User[], number]>;
  getFollowingUsers: (id: number, queryObject?: Pagination) => Promise<[User[], number]>;
  follows: (visitorId: number, checkedUserId: number) => Promise<boolean>;
  follow: (visitorId: number, targetId: number) => Promise<Follower>;
  unfollow: (visitorId: number, targetId: number) => Promise<number>;
}
