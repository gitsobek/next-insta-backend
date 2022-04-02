import { AlreadyExistsError } from '../errors/already-exists.error';
import { AppError } from '../errors/app.error';
import { NotFoundError } from '../errors/not-found.error';
import type { ContainerDependencies } from '../interfaces/container';
import type { Pagination } from '../interfaces/pagination';
import type { User } from '../interfaces/user';
import { createUserModel } from '../models/user';
import { handleAsync } from '../utils/handle-async';

export type CreateUserPayload = Pick<User, 'username' | 'email' | 'password'>;

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
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
      throw new AppError('An error occurred while fetching user.', err);
    }

    if (!user) {
      throw new NotFoundError('User has not been found.');
    }

    return {
      user,
    };
  }

  async getUserByUsername(username: string): Promise<UserResponse> | never {
    const { usersRepository } = this.dependencies;

    const [user, err] = await handleAsync(usersRepository.findByUsername(username));

    if (err) {
      throw new AppError('An error occurred while fetching user.', err);
    }

    if (!user) {
      throw new NotFoundError('User has not been found.');
    }

    return {
      user,
    };
  }

  async getUsers(query: Pagination): Promise<UsersResponse> | never {
    const { usersRepository } = this.dependencies;

    const [usersObject, err] = await handleAsync(usersRepository.getUsers(query));

    if (err) {
      throw new AppError('An error occurred while fetching users.', err);
    }

    return {
      users: usersObject!.users,
      total: usersObject!.total,
      page: query.page,
      limit: query.limit,
    };
  }

  async createUser(userPayload: CreateUserPayload): Promise<UserResponse> {
    const { usersRepository, securityService, activationTokenService } = this.dependencies;
    const { username, email, password } = userPayload;

    const [foundUser, errOnSearch] = await handleAsync(usersRepository.findByUsernameOrEmail(username, email));
    
    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
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
      activationToken,
      activationTokenExpireDate
    });

    console.log('createdModel?', createdModel);

    const [newUser, errOnCreate] = await handleAsync(usersRepository.add(createdModel));

    if (errOnCreate) {
      throw new AppError('An error occurred while creating an user.', errOnCreate);
    }

    return {
      user: newUser!,
    };
  }

  async updateUser(id: number, user: Partial<User>): Promise<UserResponse> {
    const { usersRepository } = this.dependencies;

    const [foundUser, errOnSearch] = await handleAsync(usersRepository.findById(id));
    
    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
    }

    if (!foundUser) {
      throw new NotFoundError('User has not been found.');
    }

    const updatedModel = { ...foundUser, ...user };
    const [updatedUser, errOnUpdate] = await handleAsync(usersRepository.save(id, updatedModel));

    if (errOnUpdate) {
      throw new AppError('An error occurred while updating an user.', errOnUpdate);
    }

    return {
      user: updatedUser!,
    };
  }

  async deleteUser(id: number): Promise<boolean> {
    const { usersRepository } = this.dependencies;

    const [foundUser, errOnSearch] = await handleAsync(usersRepository.findById(id));
    
    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
    }

    if (!foundUser) {
      throw new NotFoundError('User has not been found.');
    }

    const [result, errOnDelete] = await handleAsync(usersRepository.delete(id));

    if (errOnDelete) {
      throw new AppError('An error occurred while deleting an user.', errOnDelete);
    }

    return !!result;
  }
}
