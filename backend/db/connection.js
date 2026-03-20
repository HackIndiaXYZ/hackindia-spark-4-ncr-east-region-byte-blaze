import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_2YhzpeSPmn1X@ep-royal-thunder-amri5u5a-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
