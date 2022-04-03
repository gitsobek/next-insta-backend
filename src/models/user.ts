import { Model } from 'objection';
import type { Gender, User as IUser, UserPublic } from '../interfaces/user';

export class User extends Model implements IUser {
  id!: number;
  email!: string;
  username!: string;
  password!: string;
  isActive!: boolean;
  avatar: string;
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

  static tableName: string = 'users';
  static idColumn: string | string[] = 'id';

  override $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  override $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export const createUserModel = (data: Partial<IUser>): IUser => {
  const entity = new User();
  Object.assign(entity, data);
  return entity;
};

export const createUserForPublic = (data: IUser): UserPublic => {
  const { password, activationToken, activationTokenExpireDate, resetPasswordToken, hashedRefreshToken, ...nonSensitiveData } = data;
  return nonSensitiveData;
} 