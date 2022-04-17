import { AlreadyExistsError } from '../errors/already-exists.error';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import type { ContainerDependencies } from '../interfaces/container';
import type { Pagination } from '../interfaces/pagination';
import type { User, UserPublic } from '../interfaces/user';
import { createUserForPublic, createUserModel } from '../models/user';
import { handleAsync } from '../utils/handle-async';
import Messages from '../consts';

export type CreateUserPayload = Pick<User, 'username' | 'email' | 'password'>;

export interface UserResponse {
  user: UserPublic;
}

export interface UsersResponse {
  users: UserPublic[];
  total: number;
  page: number;
  limit: number;
}

export class UserService {
  constructor(private dependencies: ContainerDependencies) {}

  async getUserById(id: number): Promise<UserResponse> | never {
    const { usersRepository } = this.dependencies;

    const [user, err] = await handleAsync(usersRepository.findById(id));

    if (err) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, err);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    return {
      user: createUserForPublic(user)
    };
  }

  async getUserByUsername(username: string): Promise<UserResponse> | never {
    const { usersRepository } = this.dependencies;

    const [user, err] = await handleAsync(usersRepository.findByUsername(username));

    if (err) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, err);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    return {
      user: createUserForPublic(user)
    };
  }

  async getUserByProps(queryUser: Partial<User>): Promise<UserResponse> | never {
    const { usersRepository } = this.dependencies;

    const [user, err] = await handleAsync(usersRepository.findBySchema(queryUser));

    if (err) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, err);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    return {
      user: createUserForPublic(user)
    };
  }

  async getUsers(query: Pagination): Promise<UsersResponse> | never {
    const { usersRepository } = this.dependencies;

    const [usersObject, err] = await handleAsync(usersRepository.getUsers(query));

    if (err) {
      throw new AppError(Messages.USERS.FIND_ALL.APP_ERROR, err);
    }

    return {
      users: (usersObject!.users || []).map(createUserForPublic),
      total: usersObject!.total || 0,
      page: query.page,
      limit: query.limit,
    };
  }

  async createUser(userPayload: CreateUserPayload): Promise<UserResponse> {
    const { usersRepository, securityService, activationTokenService } = this.dependencies;
    const { username, email, password } = userPayload;

    const [foundUser, errOnSearch] = await handleAsync(usersRepository.findByUsernameOrEmail(username, email));
    
    if (errOnSearch) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnSearch);
    }

    if (foundUser) {
      if (foundUser.username === username) {
        throw new AlreadyExistsError(`User with username ${username} already exists.`);
      }

      if (foundUser.email === email) {
        throw new AlreadyExistsError(`User with e-mail ${email} already exists.`);
      }
    }

    const hashedPassword = securityService.performHash(password)
    const activationToken = activationTokenService.getActivationToken(username);
    const activationTokenExpireDate = activationTokenService.getActivationTokenExpireDate();
    const createdModel = createUserModel({
      username,
      email,
      password: hashedPassword,
      isActive: activationTokenService.shouldUserBeActive(),
      activationToken,
      activationTokenExpireDate
    });

    const [newUser, errOnCreate] = await handleAsync(usersRepository.add(createdModel));

    if (errOnCreate) {
      throw new AppError(Messages.USERS.CREATE.APP_ERROR, errOnCreate);
    }

    return {
      user: createUserForPublic(newUser!),
    };
  }

  async updateUser(id: number, user: Partial<User>): Promise<UserResponse> {
    const { usersRepository } = this.dependencies;

    const [foundUser, errOnSearch] = await handleAsync(usersRepository.findById(id));
    
    if (errOnSearch) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnSearch);
    }

    if (!foundUser) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const updatedModel = { ...foundUser, ...user };
    const [updatedUser, errOnUpdate] = await handleAsync(usersRepository.save(id, updatedModel));

    if (errOnUpdate) {
      throw new AppError(Messages.USERS.UPDATE.APP_ERROR, errOnUpdate);
    }

    return {
      user: createUserForPublic(updatedUser!),
    };
  }

  async deleteUser(id: number): Promise<boolean> {
    const { usersRepository } = this.dependencies;

    const [foundUser, errOnSearch] = await handleAsync(usersRepository.findById(id));
    
    if (errOnSearch) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnSearch);
    }

    if (!foundUser) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const [result, errOnDelete] = await handleAsync(usersRepository.delete(id));

    if (errOnDelete) {
      throw new AppError(Messages.USERS.DELETE.APP_ERROR, errOnDelete);
    }

    return !!result;
  }
}
