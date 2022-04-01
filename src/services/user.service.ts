import { AppError } from '../errors/app.error';
import type { DatabaseDependencies } from '../interfaces/app';
import type { Pagination } from '../interfaces/pagination';
import type { User } from '../interfaces/user';
import { handleAsync } from '../utils/handle-async';

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export class UserService {
  constructor(private dependencies: DatabaseDependencies) {}

  async getUsers(query: Pagination): Promise<UsersResponse> {
    const { usersRepository } = this.dependencies;

    const [usersObject, err] = await handleAsync(usersRepository.getUsers(query));

    if (err) {
      throw new AppError('An error occurred while fetching users.');
    }

    return {
      users: usersObject!.users,
      total: usersObject!.total,
      page: query.page,
      limit: query.limit
    };
  }
}
