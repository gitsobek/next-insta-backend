export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export interface User {
  id: number;
  email: string;
  password: string;
  avatar?: string;
  gender?: Gender;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phoneNumber?: string;
  created_at?: string;
  updated_at?: string;
}
