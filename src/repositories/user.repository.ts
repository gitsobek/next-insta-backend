import type { Pagination } from '../interfaces/pagination';
import type { User } from '../interfaces/user';

export interface UserRepository {
  findById: (id: number) => Promise<User | undefined>;
  findBySchema: (user: Partial<User>) => Promise<User | undefined>;
  findByUsername: (username: string) => Promise<User | undefined>;
  findByUsernameOrEmail: (username: string, email: string) => Promise<User | undefined>;
  getUsers: (query: Pagination) => Promise<{
    users: User[];
    total: number;
  }>;
  add: (user: User) => Promise<User>;
  save: (id: number, user: Partial<User>) => Promise<User>;
  delete: (id: number) => Promise<number>;
}
