import type { PaginationResponse } from "./pagination";

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  isActive: boolean;
  avatar?: string;
  gender?: Gender;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  activationToken?: string | null;
  activationTokenExpireDate?: number | null;
  resetPasswordToken?: string | null;
  hashedRefreshToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserPublic = Omit<
  User,
  'password' | 'activationToken' | 'activationTokenExpireDate' | 'resetPasswordToken' | 'hashedRefreshToken'
>;

export interface UserResponse {
  user: UserPublic;
}

export interface UsersResponse extends PaginationResponse {
  users: UserPublic[];
}
