import type { ActivationTokenService } from './activation-token.service';
import type { SecurityService } from './security.service';
import type { UserService } from './user.service';

export interface ServiceDependencies {
  securityService: SecurityService;
  activationTokenService: ActivationTokenService;
  userService: UserService;
}

export * from './user.service';
export * from './activation-token.service';
export * from './security.service';
