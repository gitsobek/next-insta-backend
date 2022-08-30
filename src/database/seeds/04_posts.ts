import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { Post } from '../../interfaces/post';

type PostMigrate = Omit<Post, 'id'>;

function createFakePost(id: number): PostMigrate {
  return {
    photoUrl: faker.internet.avatar(),
    description: faker.lorem.words(6),
    location: faker.address.city(),
    userId: id,
  };
}

function createFakePosts(id: number): PostMigrate[] {
  return Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => i + 1).map(() => createFakePost(id));
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('posts').del();

  const posts = Array.from({ length: 24 }, (_, i) => i + 1)
    .map(createFakePosts)
    .flat();

  // Inserts seed entries
  await knex('posts').insert(posts);
}
