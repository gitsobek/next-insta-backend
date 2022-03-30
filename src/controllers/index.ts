import type { Controller } from '../interfaces/app';
import type { UserRepository } from '../repositories/user.repository';

export interface ControllerDependencies {
  usersController: Controller<UserRepository>;
}

export * from './users';
