import type { Pagination } from '../../interfaces/pagination';
import type { User } from '../../interfaces/user';
import type { UserRepository } from '../user.repository';
import { User as UserTable } from '../../models/user';

export class UserObjectionRepository implements UserRepository {
  findByUsername: (username: string) => Promise<User | undefined>;
  findById: (id: string) => Promise<User | undefined>;

  public async getUsers(queryObject: Pagination): Promise<{ users: User[]; total: number }> {
    const query = UserTable.query().select();
    const [data, total] = await Promise.all([
      query
        .orderBy(queryObject.order.by, queryObject.order.type)
        .offset((queryObject.page - 1) * queryObject.limit)
        .limit(queryObject.limit),
      query.resultSize(),
    ]);

    return { users: data, total };
  }

  add: (user: User) => Promise<User>;
  save: (user: Partial<User>) => Promise<User>;
  delete: (ids: string[]) => Promise<any>;
}
