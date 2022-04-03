import type { AuthenticationClient } from '../factories/authentication/authentication-client.types';
import type { ActivationTokenService } from './activation-token.service';
import type { SecurityService } from './security.service';
import type { TokenService } from './token.service';
import type { UserService } from './user.service';

export interface ServiceDependencies {
  securityService: SecurityService;
  activationTokenService: ActivationTokenService;
  userService: UserService;
  tokenService: TokenService;
  authService: AuthenticationClient;
}

export * from './user.service';
export * from './activation-token.service';
export * from './security.service';
export * from './token.service';
