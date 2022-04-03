import { AppError } from '../../../errors/app.error';
import { handleAsync } from '../../../utils/handle-async';
import type { ContainerDependencies } from '../../../interfaces/container';
import { type AuthenticationClient, type AuthToken, type TokenPayload, TokenType } from '../authentication-client.types';
import { ForbiddenError } from '../../../errors/forbidden.error';
import { UnauthorizedError } from '../../../errors/unauthorized.error';
import { NotFoundError } from '../../../errors/not-found.error';
import type { User } from '../../../interfaces/user';

export class CustomAuthenticationClient implements AuthenticationClient {
  constructor(private dependencies: ContainerDependencies) {}

  async login(username: string, password: string): Promise<AuthToken> {
    const { usersRepository, securityService, tokenService, appConfig } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
    }

    if (!user || !securityService.compareWithHash(password, user.password)) {
      throw new UnauthorizedError('Invalid username or password.');
    }

    if (appConfig.userActivationConfig.isUserActivationNeeded && !user.isActive) {
      throw new ForbiddenError('This account is inactive.');
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
      throw new AppError('An error has occurred while creating access token.', errOnTokenSave);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async isAuthenticated(accessToken: string): Promise<boolean> {
    const { appConfig, tokenService } = this.dependencies;
    return tokenService.verifyToken(accessToken, appConfig.accessTokenConfig);
  }

  async resetPassword(username: string, newPassword: string): Promise<boolean> {
    const { usersRepository, securityService } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
    }

    if (!user) {
      throw new NotFoundError('User has not been found.');
    }

    const hashedNewPassword = securityService.performHash(newPassword);

    const data = {
      password: hashedNewPassword,
      resetPasswordToken: null,
    };

    const [result, errOnPasswordSave] = await handleAsync(usersRepository.save(user.id, data));

    if (errOnPasswordSave) {
      throw new AppError('An error has occurred while updating an user.', errOnPasswordSave);
    }

    return !!result;
  }

  async setNewPassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
    const { usersRepository, securityService } = this.dependencies;
    const [user, errOnSearch] = await handleAsync(usersRepository.findByUsername(username));

    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
    }

    if (!user) {
      throw new NotFoundError('User has not been found.');
    }

    if (!securityService.compareWithHash(oldPassword, user.password)) {
      throw new UnauthorizedError('Invalid password.');
    }

    const hashedNewPassword = securityService.performHash(newPassword);

    const data = {
      password: hashedNewPassword,
    };

    const [result, errOnPasswordSave] = await handleAsync(usersRepository.save(user.id, data));

    if (errOnPasswordSave) {
      throw new AppError('An error has occurred while updating an user.', errOnPasswordSave);
    }

    return !!result;
  }

  async refreshToken(accessToken: string, refreshToken: string): Promise<AuthToken> {
    const { appConfig, securityService, tokenService, usersRepository } = this.dependencies;

    const payload = (await tokenService.verifyToken(accessToken, appConfig.accessTokenConfig, {
      ignoreExpiration: true,
    })) as TokenPayload<User['id']>;

    const [user, errOnSearch] = await handleAsync(
      usersRepository.findBySchema({
        id: payload.userId,
        hashedRefreshToken: securityService.performHash(refreshToken),
      }),
    );

    if (errOnSearch) {
      throw new AppError('An error occurred while searching for existing user.', errOnSearch);
    }

    if (!user) {
      throw new NotFoundError('User has not been found.');
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
      throw new AppError('An error has occurred while creating access token.', errOnTokenSave);
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
