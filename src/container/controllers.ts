import { asFunction, type AwilixContainer } from 'awilix';
import {
  type ControllerDependencies,
  createUsersController,
  createProfilesController,
  createPostsController,
  createCommentsController,
} from '../controllers';

export async function registerControllers(
  container: AwilixContainer,
): Promise<AwilixContainer<ControllerDependencies>> {
  container.register({
    usersController: asFunction(createUsersController),
    profilesController: asFunction(createProfilesController),
    postsController: asFunction(createPostsController),
    commentsController: asFunction(createCommentsController),
  });

  return container;
}
