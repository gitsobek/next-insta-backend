import { Knex } from 'knex';
import { PostLike } from '../../interfaces/post';
import { generateUniqueRandomNumbers } from '../../utils/random';

function createFakePostLike(id: number, userId: number): PostLike {
  return {
    postId: id,
    userId: userId,
  };
}

function createFakePostLikes(id: number): PostLike[] {
  const size = Math.floor(Math.random() * 24);
  const uniqueIds = generateUniqueRandomNumbers(1, 24, size);
  return Array.from({ length: size }, (_, i) => i).map((idx) =>
    createFakePostLike(id, uniqueIds[idx]),
  );
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('post_likes').del();

  const postLikes = Array.from({ length: 24 }, (_, i) => i + 1)
    .map(createFakePostLikes)
    .flat();

  // Inserts seed entries
  await knex('post_likes').insert(postLikes);
}
