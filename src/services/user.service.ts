import { User } from '../interfaces/user';
import { User as UserTable } from '../models/user';
import type { UserRepository } from '../repositories/user.repository';

export class UserService implements UserRepository {
  async getUsers(): Promise<User[]> {
    return await UserTable.query().select();
  }
}
