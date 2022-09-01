import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comment_likes', (table) => {
    table.increments('id').primary();
    table
      .integer('commentId')
      .notNullable()
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE');
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('createdAt').defaultTo(new Date().toISOString());
    table.timestamp('updatedAt').defaultTo(new Date().toISOString());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE comment_likes CASCADE');
}
