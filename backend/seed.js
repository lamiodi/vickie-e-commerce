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
  {
    name: 'Premium Yoga Mat',
    description: 'High-quality anti-slip yoga mat for all your fitness needs.',
    category: 'Accessories',
    price: 49.99,
    video_url: 'https://example.com/video.mp4',
    video_thumbnail_url: '/purple-yoga-mat-rolled.jpg',
    variants: [
      {
        size: 'Standard',
        color: 'Purple',
        stock: 50,
        images: ['/purple-yoga-mat-rolled.jpg', '/purple-yoga-mat.png'],
      },
    ],
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes for daily jogging.',
    category: 'Footwear',
    price: 89.99,
    video_thumbnail_url: '/colorful-running-shoes.jpg',
    variants: [
      {
        size: '42',
        color: 'Red/Blue',
        stock: 20,
        images: ['/colorful-running-shoes.jpg', '/colorful-running-shoes-sneakers.jpg'],
      },
      {
        size: '43',
        color: 'Red/Blue',
        stock: 15,
        images: ['/colorful-running-shoes.jpg'],
      },
    ],
  },
  {
    name: 'Athletic Hoodie',
    description: 'Comfortable hoodie for outdoor sports.',
    category: 'Apparel',
    price: 59.99,
    video_thumbnail_url: '/black-crop-hoodie-women.jpg',
    variants: [
      {
        size: 'M',
        color: 'Black',
        stock: 30,
        images: [
          '/black-crop-hoodie-women.jpg',
          '/black-crop-hoodie-women-athletic-wear-fashion-phot.jpg',
        ],
      },
    ],
  },
  {
    name: 'Sports Duffel Bag',
    description: 'Spacious bag for your gym equipment.',
    category: 'Accessories',
    price: 39.99,
    video_thumbnail_url: '/black-sports-duffel-bag.jpg',
    variants: [
      {
        size: 'One Size',
        color: 'Black',
        stock: 40,
        images: [
          '/black-sports-duffel-bag.jpg',
          '/black-sports-duffel-bag-gym-bag-modern-design.jpg',
        ],
      },
    ],
  },
];

const seed = async () => {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM product_variants');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM users');

    // Create a test user
    const userRes = await pool.query(
      `
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `,
      ['test@example.com', 'hashed_password_here', 'Test User', 'customer']
    );

    console.log('Created test user:', userRes.rows[0].id);

    for (const p of products) {
      const productRes = await pool.query(
        `
        INSERT INTO products (name, description, category, price, video_url, video_thumbnail_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
        [p.name, p.description, p.category, p.price, p.video_url || null, p.video_thumbnail_url]
      );

      const productId = productRes.rows[0].id;
      console.log(`Created product: ${p.name} (${productId})`);

      for (const v of p.variants) {
        await pool.query(
          `
          INSERT INTO product_variants (product_id, size, color, stock, images)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [productId, v.size, v.color, v.stock, JSON.stringify(v.images)]
        );
      }
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await pool.end();
  }
};

seed();
