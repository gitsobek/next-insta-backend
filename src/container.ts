import * as http from 'http';
import { asFunction, asValue, type AwilixContainer, createContainer as createAwilixContainer, InjectionMode } from 'awilix';
import { createApp } from './app';
import { appConfig } from './config/app';
import { registerCommonDependencies } from './container/common';
import { registerRouting } from './container/routing';
import { registerMiddlewares } from './container/middlewares';
import { registerDatabase } from './container/database';
import type { ConfigDependencies } from './interfaces/app';
import type { ContainerDependencies } from './interfaces/container';
import { registerServices } from './container/services';
import { registerControllers } from './container/controllers';

export async function createContainer(
  dependencies?: Partial<ConfigDependencies>,
): Promise<AwilixContainer<ContainerDependencies>> {
  const createdConfig = dependencies?.appConfig ? dependencies.appConfig : appConfig;

  const container: AwilixContainer = createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
  });

  await registerDatabase(container, dependencies);
  await registerCommonDependencies(createdConfig, container);
  await registerMiddlewares(container);
  await registerServices(container);
  await registerControllers(container);
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
