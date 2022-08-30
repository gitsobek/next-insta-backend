import { asFunction, type AwilixContainer } from 'awilix';
import {
  type ControllerDependencies,
  createUsersController,
  createProfilesController,
  createPostsController,
} from '../controllers';

export async function registerControllers(
  container: AwilixContainer,
): Promise<AwilixContainer<ControllerDependencies>> {
  container.register({
    usersController: asFunction(createUsersController),
    profilesController: asFunction(createProfilesController),
    postsController: asFunction(createPostsController),
  });

  return container;
}
