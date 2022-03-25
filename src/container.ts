import * as http from 'http';
import { asFunction, asValue, AwilixContainer, createContainer as createAwilixContainer, InjectionMode } from 'awilix';
import { createApp } from './app';
import { appConfig } from './config/app';
import { registerCommonDependencies } from './container/common';
import { registerRouting } from './container/routing';
import { registerMiddlewares } from './container/middlewares';
import { registerDatabase } from './container/database';
import { ConfigDependencies } from './models/app';
import { ContainerDependencies } from './models/container';

export async function createContainer(
  dependencies?: Partial<ConfigDependencies>,
): Promise<AwilixContainer<ContainerDependencies>> {
  const createdConfig = dependencies?.appConfig ? dependencies.appConfig : appConfig;

  const container: AwilixContainer = createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
  });

  registerDatabase(container, dependencies);

  await registerCommonDependencies(createdConfig, container);
  await registerMiddlewares(container);
  await registerRouting(container);

  container.register({
    app: asFunction(createApp).singleton(),
  });

  const { app } = container.cradle;

  container.register({
    server: asValue(http.createServer(await app)),
  });

  return container;
}
