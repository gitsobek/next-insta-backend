import { asClass, type AwilixContainer } from 'awilix';
import type { AuthenticationClientFactory } from '../factories/authentication/authentication-client.factory';
import type { AppConfig } from '../interfaces/app';
import {
  type ServiceDependencies,
  UserService,
  ProfileService,
  SecurityService,
  ActivationTokenService,
  TokenService,
  PostService,
  CommentService,
} from '../services';
import { InternalJobManager } from '../services/scheduler/internal-job-manager.service';
import { JobManager } from '../services/scheduler/job-manager.service';
import { SchedulerService } from '../services/scheduler/scheduler.service';

export async function registerServices(
  container: AwilixContainer,
  appConfig: AppConfig,
): Promise<AwilixContainer<ServiceDependencies>> {
  const authenticationFactory: AuthenticationClientFactory =
    container.resolve('authenticationFactory');
  const AuthenticationClient = authenticationFactory.getAuthenticationClient(
    appConfig.authenticationStrategy,
  );

  container.register({
    securityService: asClass(SecurityService).singleton(),
    tokenService: asClass(TokenService).singleton(),
    activationTokenService: asClass(ActivationTokenService).singleton(),
    userService: asClass(UserService).singleton(),
    profileService: asClass(ProfileService).singleton(),
    postService: asClass(PostService).singleton(),
    commentService: asClass(CommentService).singleton(),
    authService: asClass(AuthenticationClient).singleton(),
    internalJobManager: asClass(InternalJobManager).singleton(),
    jobManager: asClass(JobManager).singleton(),
    schedulerService: asClass(SchedulerService).singleton(),
  });

  return container;
}
