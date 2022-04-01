import type { UserService } from './user.service';

export interface ServiceDependencies {
  userService: UserService;
}

export * from './user.service';
