import { Knex } from 'knex';

export class Transaction {
    static async createTransaction(db: Knex, transactionData: any) {
        return await db('transactions').insert(transactionData);
    }
}
