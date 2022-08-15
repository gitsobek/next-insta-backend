import type { User } from '../../interfaces/user';

export enum AuthenticationStrategy {
  CUSTOM_JWT_V1 = 'custom_jwt_v1',
}

export enum TokenType {
  USER = 'user',
  CUSTOM = 'custom',
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload<T = number> {
  userId: T;
  username: string;
  type: TokenType;
  accessExpirationInSeconds?: number;
  refreshExpirationInSeconds?: number;
}

export interface TokenConfig {
  expirationInSeconds: number;
  secret: string;
}

export interface AuthenticationClient {
  login: (username: string, password: string) => Promise<AuthToken>;
  isAuthenticated: (accessToken: string) => Promise<TokenPayload<User['id']>>;
  requestPasswordReset: (username: string) => Promise<boolean>;
  resetPassword: (username: string, newPassword: string) => Promise<boolean>;
  setNewPassword: (username: string, oldPassword: string, newPassword: string) => Promise<boolean>;
  refreshToken: (accessToken: string, refreshToken: string) => Promise<AuthToken>;
  getTokenInfo(token: string): TokenPayload<User['id']>;
  logout(username: string): Promise<boolean>;
}
