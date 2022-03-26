import { asFunction, asValue, type AwilixContainer } from 'awilix';
import type { AppConfig, CommonDependencies } from '../interfaces/app';
import { createRouter } from '../routes';
import { hideDetailsFromProduction } from '../tools/hide-details';
import { createLogger } from '../tools/logger';
import { createValidator } from '../tools/validator';

export async function registerCommonDependencies(
  appConfig: AppConfig,
  container: AwilixContainer,
): Promise<AwilixContainer<CommonDependencies>> {
  container.register({
    port: asValue(appConfig.port),
    appConfig: asValue(appConfig),
    router: asFunction(createRouter).singleton(),
    logger: asValue(createLogger(appConfig.env)),
    validator: asValue(createValidator()),
    hideDetailsFromProduction: asValue(hideDetailsFromProduction(appConfig.env)),
  });

  return container;
}
