import { asFunction, type AwilixContainer } from 'awilix';
import type { RoutingDependencies } from '../routes';
import { usersRouting, profilesRouting, postsRouting, commentsRouting } from '../routes';

export async function registerRouting(
  container: AwilixContainer,
): Promise<AwilixContainer<RoutingDependencies>> {
  container.register({
    usersRouting: asFunction(usersRouting),
    profilesRouting: asFunction(profilesRouting),
    postsRouting: asFunction(postsRouting),
    commentsRouting: asFunction(commentsRouting),
  });

  return container;
}
