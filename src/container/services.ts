import { asClass, type AwilixContainer } from 'awilix';
import { type ServiceDependencies, UserService, SecurityService, ActivationTokenService } from '../services';

export async function registerServices(container: AwilixContainer): Promise<AwilixContainer<ServiceDependencies>> {
  container.register({
    securityService: asClass(SecurityService).singleton(),
    activationTokenService: asClass(ActivationTokenService).singleton(),
    userService: asClass(UserService).singleton(),
  });

  return container;
}
