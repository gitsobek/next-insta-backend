import { asFunction, type AwilixContainer } from 'awilix';
import { createApp } from '../app';
import { ApplicationFactory } from '../factories/application/application.factory';
import type { AppConfig, AppDependencies } from '../interfaces/app';

export async function registerServer(
  container: AwilixContainer,
  appConfig: AppConfig,
): Promise<AwilixContainer<AppDependencies>> {
  const applicationFactory: ApplicationFactory = container.resolve('applicationFactory');
  const appBuilder = applicationFactory.getApplicationBuilder(appConfig.appType);

  container.register({
    app: asFunction(createApp).singleton(),
    server: asFunction(appBuilder).singleton(),
  });

  return container;
}
