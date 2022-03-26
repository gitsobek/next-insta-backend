import { asClass, type AwilixContainer } from 'awilix';
import { ServiceDependencies, UserService } from '../services';

export async function registerServices(container: AwilixContainer): Promise<AwilixContainer<ServiceDependencies>> {
  container.register({
    userService: asClass(UserService).singleton(),
  });

  return container;
}
