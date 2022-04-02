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
  avatar?: string;
  gender?: Gender;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  activationToken?: string | null;
  activationTokenExpireDate?: number | null;
  createdAt: string;
  updatedAt: string;
}
