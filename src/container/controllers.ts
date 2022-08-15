import { asFunction, type AwilixContainer } from 'awilix';
import { type ControllerDependencies, createUsersController } from '../controllers';
import { createProfilesController } from '../controllers/profiles';

export async function registerControllers(
  container: AwilixContainer,
): Promise<AwilixContainer<ControllerDependencies>> {
  container.register({
    usersController: asFunction(createUsersController),
    profilesController: asFunction(createProfilesController),
  });

  return container;
}
