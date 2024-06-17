import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; 
import db from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/v2', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


db.migrate.latest()
  .then(() => console.log('Database migrated'))
  .catch((err) => console.error('Database migration failed', err));
