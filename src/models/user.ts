import { Model } from 'objection';
import type { Gender, User as IUser } from '../interfaces/user';
import * as bcrypt from 'bcrypt';

export class User extends Model implements IUser {
  id!: number;
  email!: string;
  password!: string;
  avatar: string;
  gender?: Gender;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  created_at?: string;
  updated_at?: string;

  static tableName: string = 'users';
  static idColumn: string | string[] = 'id';

  static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  }

  static comparePassword(user: IUser, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }
}
