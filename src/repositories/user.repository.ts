import type { Pagination } from '../interfaces/pagination';
import type { User } from '../interfaces/user';

export interface UserRepository {
  findByUsername: (username: string) => Promise<User | undefined>;
  findById: (id: string) => Promise<User | undefined>;
  getUsers: (query: Pagination) => Promise<{
    users: User[];
    total: number;
  }>;
  add: (user: User) => Promise<User>;
  save: (user: Partial<User>) => Promise<User>;
  delete: (ids: string[]) => Promise<any>;
}
