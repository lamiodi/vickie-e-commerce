import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

const run = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Updating users table schema...');
    
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_token VARCHAR(255);');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_requested_at TIMESTAMP WITH TIME ZONE;');

    console.log('Users schema updated successfully!');
  } catch (err) {
    console.error('Error updating schema:', err);
  } finally {
    await pool.end();
  }
};

run();
