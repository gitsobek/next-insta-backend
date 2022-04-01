import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 128).unique().notNullable();
    table.string('username', 64).unique().notNullable();
    table.string('password').notNullable();
    table.string('avatar').nullable();
    table.enum('gender', ['male', 'female', 'unknown']).nullable();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('bio').nullable();
    table.string('phoneNumber', 26).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
