import { asClass, asFunction, asValue, type AwilixContainer } from 'awilix';
import { ApplicationFactory } from '../factories/application/application.factory';
import { DatabaseFactory } from '../factories/database/database.factory';
import type { AppConfig, CommonDependencies } from '../interfaces/app';
import { createRouter } from '../routes';
import { hideDetailsFromProduction } from '../utils/hide-details';
import { createLogger } from '../tools/logger';
import { createValidator } from '../tools/validator';
import { AuthenticationClientFactory } from '../factories/authentication/authentication-client.factory';

export async function registerCommonDependencies(
  container: AwilixContainer,
  appConfig: AppConfig
): Promise<AwilixContainer<CommonDependencies>> {
  container.register({
    port: asValue(appConfig.port),
    appConfig: asValue(appConfig),
    router: asFunction(createRouter).singleton(),
    logger: asValue(createLogger(appConfig.env)),
    validator: asValue(createValidator()),
    hideDetailsFromProduction: asValue(hideDetailsFromProduction(appConfig.env)),
  });

  container.register({
    applicationFactory: asClass(ApplicationFactory),
    databaseFactory: asClass(DatabaseFactory),
    authenticationFactory: asClass(AuthenticationClientFactory)
  })

  return container;
}
