import type { Controller } from '../interfaces/app';
import type { UserHandlers } from './users';

export interface ControllerDependencies {
  usersController: Controller<UserHandlers>;
}

export * from './users';
