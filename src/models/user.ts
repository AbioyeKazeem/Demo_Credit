import { Knex } from 'knex';

export class User {
    static async createUser(db: Knex, userData: any) {
        return await db('users').insert(userData);
    }

    static async findUserById(db: Knex, userId: number) {
        return await db('users').where({ id: userId }).first();
    }

    static async findUserByEmail(db: Knex, email: string) {
        return await db('users').where({ email }).first();
    }

    static async updateUserBalance(db: Knex, userId: number, newBalance: number) {
        return await db('users').where({ id: userId }).update({ balance: newBalance });
    }
}
