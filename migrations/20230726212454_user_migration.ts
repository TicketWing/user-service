import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(function() {
      return knex.schema.createTable('users', function(table) {
        table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('name').nullable();
        table.integer('age').nullable();
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("users");
}
