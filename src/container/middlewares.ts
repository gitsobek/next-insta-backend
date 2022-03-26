import { asFunction, type AwilixContainer } from 'awilix';
import { errorHandler } from '../middlewares/error-handler';
import type { MiddlewareDependencies } from '../interfaces/app';

export async function registerMiddlewares(
  container: AwilixContainer,
): Promise<AwilixContainer<MiddlewareDependencies>> {
  container.register({
    errorHandler: asFunction(errorHandler),
  });

  return container;
}
