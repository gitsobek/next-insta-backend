import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('stories', (table) => {
    table.increments('id').primary();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('photoUrl', 1024).notNullable();
    table.timestamp('createdAt').defaultTo(new Date().toISOString());
    table.timestamp('updatedAt').defaultTo(new Date().toISOString());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE stories CASCADE');
}
