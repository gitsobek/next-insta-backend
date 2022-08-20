import { Model, RelationMappings } from 'objection';
import * as path from 'path';
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

  static override tableName: string = 'users';
  static override idColumn: string | string[] = 'id';

  static override get relationMappings(): RelationMappings {
    return {
      stories: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Story'),
        join: {
          from: 'users.id',
          to: 'stories.userId',
        },
      },
      followers: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Follower'),
        join: {
          from: 'users.id',
          to: 'followers.userId',
        },
      },
    };
  }

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
  const {
    password,
    activationToken,
    activationTokenExpireDate,
    resetPasswordToken,
    hashedRefreshToken,
    ...nonSensitiveData
  } = data;
  return nonSensitiveData;
};
