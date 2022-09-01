import { Knex } from 'knex';
import type { CommentLike } from '../../interfaces/comment';
import { generateUniqueRandomNumbers } from '../../utils/random';

function createFakeCommentLike(id: number, userId: number): CommentLike {
  return {
    commentId: id,
    userId: userId,
  };
}

function createFakeCommentLikes(id: number): CommentLike[] {
  const size = Math.floor(Math.random() * 24);
  const uniqueIds = generateUniqueRandomNumbers(1, 24, size);
  return Array.from({ length: size }, (_, i) => i).map((idx) =>
    createFakeCommentLike(id, uniqueIds[idx]),
  );
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('comment_likes').del();

  const commentLikes = Array.from({ length: 24 }, (_, i) => i + 1)
    .map(createFakeCommentLikes)
    .flat();

  // Inserts seed entries
  await knex('comment_likes').insert(commentLikes);
}
