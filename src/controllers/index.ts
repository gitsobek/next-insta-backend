import type { Controller } from '../interfaces/app';
import type { ProfileHandlers } from './profiles';
import type { UserHandlers } from './users';

export interface ControllerDependencies {
  usersController: Controller<UserHandlers>;
  profilesController: Controller<ProfileHandlers>;
}

export * from './users';
