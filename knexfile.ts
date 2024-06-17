import dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './migrations',
  },
  useNullAsDefault: true,
};

export default config;
