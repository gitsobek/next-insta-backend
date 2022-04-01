import type { Controller } from '../interfaces/app';
import type { UserService } from '../services';

export interface ControllerDependencies {
  usersController: Controller<UserService>;
}

export * from './users';
