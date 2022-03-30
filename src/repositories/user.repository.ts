import type { User } from '../interfaces/user';

export interface UserRepository {
  getUsers: () => Promise<User[]>;
}
