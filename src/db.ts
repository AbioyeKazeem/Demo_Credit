import knex from 'knex';
import dotenv from 'dotenv';
import knexConfig from '../knexfile'; 

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db = knex(config);

export default db;
