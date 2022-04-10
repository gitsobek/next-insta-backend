import { asFunction, type AwilixContainer } from 'awilix';
import { errorHandler } from '../middlewares/error-handler';
import type { MiddlewareDependencies } from '../interfaces/app';
import { apiKeyHandler } from '../middlewares/api-key-handler';
import { featureDisabledHandler } from '../middlewares/feature-disabled';
import { requireAccessHandler } from '../middlewares/require-access-handler';

export async function registerMiddlewares(
  container: AwilixContainer,
): Promise<AwilixContainer<MiddlewareDependencies>> {
  container.register({
    requireAccessHandler: asFunction(requireAccessHandler),
    apiKeyHandler: asFunction(apiKeyHandler),
    errorHandler: asFunction(errorHandler),
    featureDisabledHandler: asFunction(featureDisabledHandler),
  });

  return container;
}
