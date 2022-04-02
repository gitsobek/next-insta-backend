import { Model, Pojo } from 'objection';
import type { Gender, User as IUser } from '../interfaces/user';

export class User extends Model implements IUser {
  id!: number;
  email!: string;
  username!: string;
  password!: string;
  avatar: string;
  gender?: Gender;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  activationToken?: string | null;
  activationTokenExpireDate?: number | null;
  createdAt: string;
  updatedAt: string;

  static tableName: string = 'users';
  static idColumn: string | string[] = 'id';

  override $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    const { password, activationToken, activationTokenExpireDate, ...nonSensitiveUserData } = json as User;
    return nonSensitiveUserData;
  }

  override $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  override $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export const createUserModel = (data: Partial<User>): User => {
  const entity = new User();
  Object.assign(entity, data);
  return entity;
};
