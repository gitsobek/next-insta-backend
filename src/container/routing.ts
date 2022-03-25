import { asFunction, AwilixContainer } from 'awilix';
import { RoutingDependencies } from '../routes';
import { usersRouting } from '../routes/users';

export async function registerRouting(container: AwilixContainer): Promise<AwilixContainer<RoutingDependencies>> {
  container.register({
    usersRouting: asFunction(usersRouting),
  });

  return container;
}
