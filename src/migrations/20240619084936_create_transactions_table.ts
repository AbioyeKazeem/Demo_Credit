import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.enum('type', ['fund', 'transfer', 'withdraw']).notNullable();
        table.decimal('amount', 14, 2).notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}
