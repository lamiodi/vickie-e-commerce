import pg from 'pg';
import argon2 from 'argon2';
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

  const email = 'admin@vickie.com';
  const password = 'adminpassword';
  const name = 'Admin User';

  try {
    console.log('Creating admin user...');
    
    // Check if admin exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin user already exists. Updating password...');
      const hash = await argon2.hash(password);
      await pool.query('UPDATE users SET password_hash = $1, role = $2 WHERE email = $3', [hash, 'admin', email]);
    } else {
      const hash = await argon2.hash(password);
      await pool.query(
        'INSERT INTO users (email, password_hash, name, role, is_verified) VALUES ($1, $2, $3, $4, true)',
        [email, hash, name, 'admin']
      );
    }

    console.log('Admin user created/updated successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    await pool.end();
  }
};

run();
