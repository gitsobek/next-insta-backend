import type { Controller } from '../interfaces/app';
import type { CommentHandlers } from './comments';
import type { PostHandlers } from './posts';
import type { ProfileHandlers } from './profiles';
import type { UserHandlers } from './users';

export interface ControllerDependencies {
  usersController: Controller<UserHandlers>;
  profilesController: Controller<ProfileHandlers>;
  postsController: Controller<PostHandlers>;
  commentsController: Controller<CommentHandlers>;
}

export * from './users';
export * from './posts';
export * from './comments';
export * from './profiles';
