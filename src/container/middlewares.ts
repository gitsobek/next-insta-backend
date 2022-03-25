import { asFunction, AwilixContainer } from 'awilix';
import { errorHandler } from '../middlewares/error-handler';
import { MiddlewareDependencies } from '../models/app';

export async function registerMiddlewares(
  container: AwilixContainer,
): Promise<AwilixContainer<MiddlewareDependencies>> {
  container.register({
    errorHandler: asFunction(errorHandler),
  });

  return container;
}
