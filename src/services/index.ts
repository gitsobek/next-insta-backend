import type { UserRepository } from '../repositories/user.repository';

export interface ServiceDependencies {
  userService: UserRepository;
}

export * from './user.service';
