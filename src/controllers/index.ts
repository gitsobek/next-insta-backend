import type { Controller } from '../interfaces/app';
import type { UserRepository } from '../services';

export interface ControllerDependencies {
  usersController: Controller<UserRepository>;
}

export * from './users';
