import { User } from '../interfaces/user';
import { User as UserTable } from '../models/user';

export interface UserRepository {
  getUsers: () => Promise<User[]>
}

export class UserService implements UserRepository {
  async getUsers(): Promise<User[]> {
    return await UserTable.query().select();
  }
}
