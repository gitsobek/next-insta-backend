import { asFunction, type AwilixContainer } from 'awilix';
import type { RoutingDependencies } from '../routes';
import { profilesRouting } from '../routes/profiles';
import { usersRouting } from '../routes/users';

export async function registerRouting(container: AwilixContainer): Promise<AwilixContainer<RoutingDependencies>> {
  container.register({
    usersRouting: asFunction(usersRouting),
    profilesRouting: asFunction(profilesRouting),
  });

  return container;
}
