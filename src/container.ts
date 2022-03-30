import { type AwilixContainer, createContainer as createAwilixContainer, InjectionMode } from 'awilix';
import { appConfig } from './config/app';
import { registerCommonDependencies } from './container/common';
import { registerRouting } from './container/routing';
import { registerMiddlewares } from './container/middlewares';
import { registerDatabase } from './container/database';
import type { ConfigDependencies } from './interfaces/app';
import type { ContainerDependencies } from './interfaces/container';
import { registerServices } from './container/services';
import { registerServer } from './container/server';
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
  await registerServer(container, appConfig);

  return container;
}
