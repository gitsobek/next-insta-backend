import { asClass, asFunction, asValue, type AwilixContainer } from 'awilix';
import { ApplicationFactory } from '../factories/application/application.factory';
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
    applicationFactory: asClass(ApplicationFactory),
  });

  return container;
}
