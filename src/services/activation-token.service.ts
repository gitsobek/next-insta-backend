import { ForbiddenError } from '../errors/forbidden.error';
import type { ContainerDependencies } from '../interfaces/container';

export class ActivationTokenService {
  constructor(private dependencies: ContainerDependencies) {}

  getActivationToken(value: string, skipConfiguration: boolean = false): string | null {
    const { securityService, appConfig } = this.dependencies;
    return appConfig.userActivationConfig.isUserActivationNeeded || skipConfiguration
      ? securityService.performHash(value)
      : null;
  }

  getActivationTokenExpireDate(skipConfiguration: boolean = false): number | null {
    const { appConfig } = this.dependencies;
    const { isUserActivationNeeded, timeToActiveAccountInDays } = appConfig.userActivationConfig;

    const now = new Date();

    return isUserActivationNeeded || skipConfiguration ? now.setDate(now.getDate() + timeToActiveAccountInDays) : null;
  }

  shouldUserBeActive(): boolean {
    const { appConfig } = this.dependencies;
    return !appConfig.userActivationConfig.isUserActivationNeeded;
  }

  isTokenExpired(expireDate?: Date | null): boolean | never {
    if (!expireDate) {
      throw new ForbiddenError('User is missing activation token expire date');
    }

    return Date.now() > expireDate.getTime();
  }
}
