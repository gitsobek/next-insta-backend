import { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import type { Comment } from '../../interfaces/comment';
import { generateUniqueRandomNumbers } from '../../utils/random';

type CommentMigrate = Omit<Comment, 'id'>;

function createFakeComment(id: number, associatedId: number): CommentMigrate {
  return {
    text: faker.lorem.words(6),
    postId: associatedId,
    userId: id,
  };
}

function createFakeComments(id: number): CommentMigrate[] {
  const size = Math.floor(Math.random() * 24);
  const uniqueIds = generateUniqueRandomNumbers(1, 24, size);
  return Array.from({ length: size }, (_, i) => i).map((idx) =>
    createFakeComment(id, uniqueIds[idx]),
  );
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('comments').del();

  const comments = Array.from({ length: 24 }, (_, i) => i + 1)
    .map(createFakeComments)
    .flat();

  // Inserts seed entries
  await knex('comments').insert(comments);
}
