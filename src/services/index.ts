import type { AuthenticationClient } from '../factories/authentication/authentication-client.types';
import type { ActivationTokenService } from './activation-token.service';
import type { PostService } from './post.service';
import type { ProfileService } from './profile.service';
import type { InternalJobManager } from './scheduler/internal-job-manager.service';
import type { JobManager } from './scheduler/job-manager.service';
import type { SchedulerService } from './scheduler/scheduler.service';
import type { SecurityService } from './security.service';
import type { TokenService } from './token.service';
import type { UserService } from './user.service';

export interface ServiceDependencies {
  securityService: SecurityService;
  activationTokenService: ActivationTokenService;
  userService: UserService;
  profileService: ProfileService;
  postService: PostService;
  tokenService: TokenService;
  authService: AuthenticationClient;
  jobManager: JobManager;
  internalJobManager: InternalJobManager;
  schedulerService: SchedulerService;
}

export * from './user.service';
export * from './profile.service';
export * from './post.service';
export * from './activation-token.service';
export * from './security.service';
export * from './token.service';
export * from './scheduler/job-manager.service';
export * from './scheduler/internal-job-manager.service';
export * from './scheduler/scheduler.service';
