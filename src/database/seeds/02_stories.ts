import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import { Story } from '../../interfaces/profile';

type StoryMigrate = Omit<Story, 'createdAt' | 'updatedAt'> & {
  userId: number;
};

function createFakeStory(id: number): StoryMigrate {
  return {
    userId: id,
    photoUrl: faker.internet.avatar(),
  };
}

function createFakeStories(id: number): StoryMigrate[] {
  return Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => i + 1).map(() => createFakeStory(id));
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('stories').del();

  const stories = Array.from({ length: 24 }, (_, i) => i + 1)
    .map(createFakeStories)
    .flat();

  // Inserts seed entries
  await knex('stories').insert(stories);
}
