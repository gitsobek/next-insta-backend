import { Knex } from 'knex';
import type { Follower } from '../../interfaces/profile';
import { generateUniqueRandomNumbers } from '../../utils/random';

function createFakeFollower(id: number, associatedId: number): Follower {
  return {
    userId: id,
    followedUserId: associatedId,
  };
}

function createFakeFollowers(id: number): Follower[] {
  const size = Math.floor(Math.random() * 24);
  const uniqueIds = generateUniqueRandomNumbers(1, 24, size);
  return Array.from({ length: size }, (_, i) => i).map((idx) => createFakeFollower(id, uniqueIds[idx]));
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('followers').del();

  const followers = Array.from({ length: 24 }, (_, i) => i + 1)
    .map(createFakeFollowers)
    .flat();

  // Inserts seed entries
  await knex('followers').insert(followers);
}
