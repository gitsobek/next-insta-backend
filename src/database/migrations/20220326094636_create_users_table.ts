import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 128).unique().notNullable();
    table.string('username', 64).unique().notNullable();
    table.string('password').notNullable();
    table.boolean('isActive').notNullable().defaultTo(true);
    table.string('avatar', 1024).nullable();
    table.enum('gender', ['male', 'female', 'unknown']).nullable();
    table.string('firstName', 50).nullable();
    table.string('lastName', 50).nullable();
    table.string('bio', 1024).nullable();
    table.string('phoneNumber', 26).nullable();
    table.string('activationToken').nullable();
    table.integer('activationTokenExpireDate').nullable();
    table.string('resetPasswordToken').nullable();
    table.string('hashedRefreshToken').nullable();
    table.timestamp('createdAt').defaultTo(new Date().toISOString());
    table.timestamp('updatedAt').defaultTo(new Date().toISOString());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE users CASCADE');
}
