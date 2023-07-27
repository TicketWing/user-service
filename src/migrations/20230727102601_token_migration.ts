import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('token');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('tokens');
}
