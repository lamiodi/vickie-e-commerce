import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const products = [
  // Activewear
  {
    name: "Alexandra's Set",
    description: 'Premium activewear set designed for comfort and performance.',
    category: 'Activewear',
    price: 39.99,
    original_price: 55.00,
    badge: 'SALE',
    variants: [
      { size: 'S', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'M', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'L', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'XL', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
    ],
  },
  {
    name: "Alicia's Set",
    description: 'The ultimate seamless workout set. Hi 

seed();
