import type { UserRepository } from './user.service';

export interface ServiceDependencies {
  userService: UserRepository;
}

export * from './user.service';
