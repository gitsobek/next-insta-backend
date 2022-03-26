import { asFunction, type AwilixContainer } from 'awilix';
import { type ControllerDependencies, createUsersController } from '../controllers';

export async function registerControllers(container: AwilixContainer): Promise<AwilixContainer<ControllerDependencies>> {
  container.register({
    usersController: asFunction(createUsersController),
  });

  return container;
}
