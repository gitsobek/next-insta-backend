import Messages from '../consts';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import type { ContainerDependencies } from '../interfaces/container';
import type { Pagination } from '../interfaces/pagination';
import type { Profile, Story } from '../interfaces/profile';
import type { UsersResponse } from '../interfaces/user';
import { handleAsync } from '../utils/handle-async';

export class ProfileService {
  constructor(private dependencies: ContainerDependencies) {}

  async addStory(userId: number, story: Story): Promise<Story[]> {
    const [, err] = await handleAsync(this.dependencies.profilesRepository.addStory(userId, story));

    if (err) {
      throw new AppError(Messages.STORY.CREATE.APP_ERROR, err);
    }

    const [stories, errOnStories] = await handleAsync(
      this.dependencies.profilesRepository.getStories(userId),
    );

    if (errOnStories) {
      throw new AppError(Messages.STORY.FIND_ALL.APP_ERROR, errOnStories);
    }

    return stories!;
  }

  async getStories(username: string): Promise<Story[]> | never {
    const { usersRepository, profilesRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [stories, errOnStories] = await handleAsync(profilesRepository.getStories(user.id));

    if (errOnStories) {
      throw new AppError(Messages.STORY.FIND_ALL.APP_ERROR, errOnStories);
    }

    return stories!;
  }

  async deleteStory(id: number, authenticatedUserId: number): Promise<Story[]> {
    const [deletedStory, err] = await handleAsync(
      this.dependencies.profilesRepository.deleteStory(id, authenticatedUserId),
    );

    if (err) {
      throw new AppError(Messages.STORY.DELETE.APP_ERROR, err);
    }

    if (!deletedStory) {
      throw new NotFoundError(Messages.STORY.FIND_ONE.NOT_FOUND);
    }

    const [stories, errOnStories] = await handleAsync(
      this.dependencies.profilesRepository.getStories(authenticatedUserId),
    );

    if (errOnStories) {
      throw new AppError(Messages.STORY.FIND_ALL.APP_ERROR, errOnStories);
    }

    return stories!;
  }

  async getProfileByUsername(
    username: string,
    authenticatedUserId: number,
  ): Promise<Profile> | never {
    const [profile, errOnProfile] = await handleAsync(
      this.dependencies.profilesRepository.getProfile(username, authenticatedUserId),
    );

    if (errOnProfile) {
      throw new AppError(Messages.PROFILE.FIND_ONE.APP_ERROR, errOnProfile);
    }

    if (!profile) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    return profile!;
  }

  async getFollowers(username: string, query: Pagination): Promise<UsersResponse> | never {
    const { usersRepository, profilesRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [profile, errOnProfile] = await handleAsync(
      profilesRepository.getFollowers(user.id, query),
    );

    if (errOnProfile) {
      throw new AppError(Messages.FOLLOWER.FOLLOWERS.APP_ERROR, errOnProfile);
    }

    const [users = [], total = 0] = profile!;

    return {
      users,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async getFollowingUsers(username: string, query: Pagination): Promise<UsersResponse> | never {
    const { usersRepository, profilesRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [profile, errOnProfile] = await handleAsync(
      profilesRepository.getFollowingUsers(user.id, query),
    );

    if (errOnProfile) {
      throw new AppError(Messages.FOLLOWER.FOLLOWING_USERS.APP_ERROR, errOnProfile);
    }

    const [users = [], total = 0] = profile!;

    return {
      users,
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async followUser(username: string, authenticatedUserId: number): Promise<boolean> | never {
    const { usersRepository, profilesRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnProfile] = await handleAsync(
      profilesRepository.follow(authenticatedUserId, user.id),
    );

    if (errOnProfile) {
      throw new AppError(Messages.FOLLOWER.FOLLOW.APP_ERROR, errOnProfile);
    }

    return !!result;
  }

  async unfollowUser(username: string, authenticatedUserId: number): Promise<boolean> | never {
    const { usersRepository, profilesRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnProfile] = await handleAsync(
      profilesRepository.unfollow(authenticatedUserId, user.id),
    );

    if (errOnProfile) {
      throw new AppError(Messages.FOLLOWER.UNFOLLOW.APP_ERROR, errOnProfile);
    }

    return !!result;
  }
}
