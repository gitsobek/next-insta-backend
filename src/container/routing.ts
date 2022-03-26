import { asFunction, type AwilixContainer } from 'awilix';
import type { RoutingDependencies } from '../routes';
import { usersRouting } from '../routes/users';

export async function registerRouting(container: AwilixContainer): Promise<AwilixContainer<RoutingDependencies>> {
  container.register({
    usersRouting: asFunction(usersRouting),
  });

  return container;
}
