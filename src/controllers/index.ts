import type { Controller } from '../interfaces/app';
import type { PostHandlers } from './posts';
import type { ProfileHandlers } from './profiles';
import type { UserHandlers } from './users';

export interface ControllerDependencies {
  usersController: Controller<UserHandlers>;
  profilesController: Controller<ProfileHandlers>;
  postsController: Controller<PostHandlers>;
}

export * from './users';
export * from './posts';
export * from './profiles';
