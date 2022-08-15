import Messages from '../consts';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import type { ContainerDependencies } from '../interfaces/container';
import type { Pagination } from '../interfaces/pagination';
import type { Profile } from '../interfaces/profile';
import type { UsersResponse } from '../interfaces/user';
import { createUserForPublic } from '../models/user';
import { handleAsync } from '../utils/handle-async';

export class ProfileService {
  constructor(private dependencies: ContainerDependencies) {}

  async getProfileByUsername(username: string, authenticatedUserId: number): Promise<Profile> | never {
    const { usersRepository, profilesRepository } = this.dependencies;

    const [user, errOnUser] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnUser) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnUser);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [profile, errOnProfile] = await handleAsync(
      Promise.all([
        profilesRepository.getStories(user.id),
        profilesRepository.getFollowers(user.id),
        profilesRepository.getFollowingUsers(user.id),
        profilesRepository.follows(authenticatedUserId, user.id),
      ]),
    );

    if (errOnProfile) {
      throw new AppError(Messages.PROFILE.FIND_ONE.APP_ERROR, errOnProfile);
    }

    const publicUser = createUserForPublic(user);
    const [stories, [, totalFollowers], [, totalFollowingUsers], isFollowing] = profile!;

    return {
      firstName: publicUser.firstName,
      lastName: publicUser.lastName,
      username: publicUser.username,
      avatarUrl: publicUser.avatar,
      bio: publicUser.bio,
      stories: stories ?? [],
      posts: 0,
      followers: totalFollowers,
      following: totalFollowingUsers,
      isFollowing: !!isFollowing
    };
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

    const [profile, errOnProfile] = await handleAsync(profilesRepository.getFollowers(user.id, query));

    if (errOnProfile) {
      throw new AppError(Messages.PROFILE.FIND_ALL.FOLLOWERS.APP_ERROR, errOnProfile);
    }

    const [followers = [], total = 0] = profile!;

    return {
      users: followers.map(createUserForPublic),
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

    const [profile, errOnProfile] = await handleAsync(profilesRepository.getFollowingUsers(user.id, query));

    if (errOnProfile) {
      throw new AppError(Messages.PROFILE.FIND_ALL.FOLLOWING_USERS.APP_ERROR, errOnProfile);
    }

    const [followingUsers = [], total = 0] = profile!;

    return {
      users: followingUsers.map(createUserForPublic),
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

    const [result, errOnProfile] = await handleAsync(profilesRepository.follow(authenticatedUserId, user.id));

    if (errOnProfile) {
      throw new AppError(Messages.PROFILE.UPDATE.FOLLOW.APP_ERROR, errOnProfile);
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

    const [result, errOnProfile] = await handleAsync(profilesRepository.unfollow(authenticatedUserId, user.id));

    if (errOnProfile) {
      throw new AppError(Messages.PROFILE.UPDATE.UNFOLLOW.APP_ERROR, errOnProfile);
    }

    return !!result;
  }
}
