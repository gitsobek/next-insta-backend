import type { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Gender, type User } from '../../interfaces/user';

function createFakeUser(): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  const genders = Object.values(Gender);
  const genderNumber = Math.floor(Math.random() * genders.length);

  return {
    email: faker.internet.exampleEmail(),
    username: faker.internet.userName(),
    password: bcrypt.hashSync('qwerty12345', 8),
    isActive: true,
    avatar: faker.internet.avatar(),
    gender: genders[genderNumber],
    firstName: faker.name.firstName(genderNumber),
    lastName: faker.name.lastName(genderNumber),
    bio: faker.lorem.words(6),
    phoneNumber: faker.phone.phoneNumber(),
  };
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  const users = Array.from({ length: 24 }, (_, i) => i + 1).map(createFakeUser);

  // Inserts seed entries
  await knex('users').insert(users);
}
