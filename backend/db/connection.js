import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Check if DATABASE_URL is configured
if (!process.env.DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL is not configured. Please create a .env file in the backend directory with DATABASE_URL set. See .env.example for reference.'
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;