import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    .then(function() {
      return knex.schema.createTable("tokens", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid("user_id").references("id").inTable("users").unique();
        table.string("refreshToken");
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("tokens");
}
