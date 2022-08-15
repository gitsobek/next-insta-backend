import type { Pagination } from '../../interfaces/pagination';
import type { User } from '../../interfaces/user';
import type { UserRepository } from '../user.repository';
import { User as UserTable } from '../../models/user';

export class UserObjectionRepository implements UserRepository {
  public async findById(id: number): Promise<User | undefined> {
    return UserTable.query().findById(id);
  }

  public async findBySchema(user: Partial<User>): Promise<User | undefined> {
    return UserTable.query().findOne(user);
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    return UserTable.query().findOne('username', '=', username);
  }

  public async findByUsernameOrEmail(username: string, email: string): Promise<User | undefined> {
    return UserTable.query().where('username', '=', username!).orWhere('email', '=', email).first();
  }

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

  public async add(user: User): Promise<User> {
    return UserTable.query().insertAndFetch(user);
  }

  public async save(id: number, user: Partial<User>): Promise<User> {
    return UserTable.query().patchAndFetchById(id, user);
  }

  public async delete(id: number): Promise<number> {
    return UserTable.query().deleteById(id);
  }
}
