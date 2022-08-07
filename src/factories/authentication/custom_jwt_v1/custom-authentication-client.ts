import { AppError } from '../../../errors/app.error';
import { handleAsync } from '../../../utils/handle-async';
import type { ContainerDependencies } from '../../../interfaces/container';
import {
  type AuthenticationClient,
  type AuthToken,
  type TokenPayload,
  TokenType,
} from '../authentication-client.types';
import { ForbiddenError } from '../../../errors/forbidden.error';
import { UnauthorizedError } from '../../../errors/unauthorized.error';
import { NotFoundError } from '../../../errors/not-found.error';
import type { User, UserPublic } from '../../../interfaces/user';
import { createUserForPublic } from '../../../models/user';
import Messages from '../../../consts';

export class CustomAuthenticationClient implements AuthenticationClient {
  constructor(private dependencies: ContainerDependencies) {}

  async login(username: string, password: string): Promise<UserPublic & AuthToken> {
    const { usersRepository, securityService, tokenService, appConfig } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnSearch) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnSearch);
    }

    if (!user || !securityService.compareWithHash(password, user.password)) {
      throw new UnauthorizedError(Messages.AUTH.INVALID_PAYLOAD);
    }

    if (appConfig.userActivationConfig.isUserActivationNeeded && !user.isActive) {
      throw new ForbiddenError(Messages.AUTH.INACTIVE_ACCOUNT);
    }

    const data = {
      userId: user.id,
      username: user.username,
      type: TokenType.USER,
    };

    const { accessToken, refreshToken, hashedRefreshToken } = await tokenService.generateTokensAndHashedRefreshToken(
      data,
    );

    const [, errOnTokenSave] = await handleAsync(tokenService.saveRefreshToken(data.userId, hashedRefreshToken));

    if (errOnTokenSave) {
      throw new AppError(Messages.TOKENS.SAVE.APP_ERROR, errOnTokenSave);
    }

    return {
      ...createUserForPublic(user),
      accessToken,
      refreshToken,
    };
  }

  async isAuthenticated(accessToken: string): Promise<TokenPayload<User['id']>> {
    const { appConfig, tokenService } = this.dependencies;
    return tokenService.verifyToken(accessToken, appConfig.accessTokenConfig);
  }

  async requestPasswordReset(username: string): Promise<boolean> {
    const { usersRepository, securityService } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    this.handleUserNotFound(errOnSearch, user);

    const resetPasswordToken = securityService.performHash(username);

    const data = {
      resetPasswordToken,
    };

    const [result, errOnTokenSave] = await handleAsync(usersRepository.save(user!.id, data));

    if (errOnTokenSave) {
      throw new AppError(Messages.USERS.UPDATE.APP_ERROR, errOnTokenSave);
    }

    return !!result;
  }

  async resetPassword(username: string, newPassword: string): Promise<boolean> {
    const { usersRepository, securityService } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    this.handleUserNotFound(errOnSearch, user);

    const hashedNewPassword = securityService.performHash(newPassword);

    const data = {
      password: hashedNewPassword,
      resetPasswordToken: null,
    };

    const [result, errOnPasswordSave] = await handleAsync(usersRepository.save(user!.id, data));

    if (errOnPasswordSave) {
      throw new AppError(Messages.USERS.UPDATE.APP_ERROR, errOnPasswordSave);
    }

    return !!result;
  }

  async setNewPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const { usersRepository, securityService } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    this.handleUserNotFound(errOnSearch, user);

    if (!securityService.compareWithHash(oldPassword, user!.password)) {
      throw new UnauthorizedError(Messages.AUTH.INVALID_PASSWORD);
    }

    const hashedNewPassword = securityService.performHash(newPassword);

    const data = {
      password: hashedNewPassword,
    };

    const [result, errOnPasswordSave] = await handleAsync(usersRepository.save(user!.id, data));

    if (errOnPasswordSave) {
      throw new AppError(Messages.USERS.UPDATE.APP_ERROR, errOnPasswordSave);
    }

    return !!result;
  }

  async refreshToken(accessToken: string, refreshToken: string): Promise<AuthToken> {
    const { appConfig, securityService, tokenService, usersRepository } = this.dependencies;

    const [payload, errOnVerification] = (await handleAsync(
      tokenService.verifyToken(accessToken, appConfig.accessTokenConfig, {
        ignoreExpiration: true,
      }),
    )) as [TokenPayload<User['id']>, Error];

    if (errOnVerification) {
      throw new UnauthorizedError(Messages.TOKENS.VERIFY.INVALID_ACCESS_TOKEN);
    }

    const [user, errOnSearch] = await handleAsync(usersRepository.findById(payload.userId));

    if (errOnSearch) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, errOnSearch);
    }

    if (!user || !securityService.compareWithHash(refreshToken, user.hashedRefreshToken!)) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }

    const data = {
      userId: user.id,
      username: user.username,
      type: TokenType.USER,
    };

    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      hashedRefreshToken,
    } = await tokenService.generateTokensAndHashedRefreshToken(data);

    const [, errOnTokenSave] = await handleAsync(tokenService.saveRefreshToken(data.userId, hashedRefreshToken));

    if (errOnTokenSave) {
      throw new AppError(Messages.TOKENS.SAVE.APP_ERROR, errOnTokenSave);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  getTokenInfo(token: string): TokenPayload<User['id']> {
    return this.dependencies.tokenService.decodeToken(token);
  }

  async logout(username: string): Promise<boolean> {
    const { usersRepository, tokenService } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    this.handleUserNotFound(errOnSearch, user);

    const [result, errOnTokenSave] = await handleAsync(tokenService.saveRefreshToken(user!.id, null));

    if (errOnTokenSave) {
      throw new AppError(Messages.TOKENS.SAVE.APP_ERROR, errOnTokenSave);
    }

    return !!result;
  }

  private handleUserNotFound(err: AppError | null, user: User | null | undefined): void | never {
    if (err) {
      throw new AppError(Messages.USERS.FIND_ONE.APP_ERROR, err);
    }

    if (!user) {
      throw new NotFoundError(Messages.USERS.FIND_ONE.NOT_FOUND);
    }
  }
}
