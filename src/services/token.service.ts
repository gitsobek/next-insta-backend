import { sign, verify, decode } from 'jsonwebtoken';
import { AppError } from '../errors/app.error';
import type { TokenConfig, TokenPayload } from '../factories/authentication/authentication-client.types';
import type { ContainerDependencies } from '../interfaces/container';
import type { User } from '../interfaces/user';
import { handleAsync } from '../utils/handle-async';

export interface VerifyTokenOptions {
  ignoreExpiration: boolean;
}

export class TokenService {
  constructor(private dependencies: ContainerDependencies) {}

  async generateToken(data: TokenPayload<User['id']>, tokenConfig: TokenConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      sign(
        { ...data },
        tokenConfig.secret,
        { expiresIn: tokenConfig.expirationInSeconds },
        (err: Error | null, token: string | undefined) => {
          if (err) {
            return reject(err);
          }

          resolve(token as string);
        },
      );
    });
  }

  async verifyToken(token: string, config: TokenConfig, opts?: VerifyTokenOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      verify(token, config.secret, { ...(opts || {}) }, (error, token) => {
        if (error) {
          return reject(error);
        }

        resolve(token);
      });
    });
  }

  decodeToken(token: string): any {
    return decode(token);
  }

  async generateTokensAndHashedRefreshToken(data: TokenPayload<User['id']>) {
    const { appConfig, securityService } = this.dependencies;

    const accessTokenConfig = {
      ...appConfig.accessTokenConfig,
      expirationInSeconds: data.accessExpirationInSeconds || appConfig.accessTokenConfig.expirationInSeconds,
    };

    const refreshTokenConfig = {
      ...appConfig.refreshTokenConfig,
      expirationInSeconds: data.refreshExpirationInSeconds || appConfig.refreshTokenConfig.expirationInSeconds,
    };

    const [accessToken, errOnAccessToken] = await handleAsync(this.generateToken(data, accessTokenConfig));
    const [refreshToken, errOnRefreshToken] = await handleAsync(this.generateToken(data, refreshTokenConfig));

    if (errOnAccessToken || errOnRefreshToken) {
      throw new AppError(
        'An error has occurred while creating access tokens.',
        (errOnAccessToken || errOnRefreshToken) as Error,
      );
    }

    const hashedRefreshToken = securityService.performHash(refreshToken!);

    return {
      accessToken: accessToken!,
      refreshToken: refreshToken!,
      hashedRefreshToken,
    };
  }

  async saveRefreshToken(userId: User['id'], token: string | null): Promise<User> {
    return this.dependencies.usersRepository.save(userId, { hashedRefreshToken: token });
  }
}
