import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.string('photoUrl', 1024).notNullable();
    table.string('description', 1024).nullable();
    table.string('location', 256).nullable();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('createdAt').defaultTo(new Date().toISOString());
    table.timestamp('updatedAt').defaultTo(new Date().toISOString());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE posts CASCADE');
}
