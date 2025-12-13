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
    video_thumbnail_url: '/placeholder.jpg',
    variants: [
      { size: 'S', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'M', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'L', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'XL', color: 'Default', stock: 10, images: ['/placeholder.jpg'] },
    ],
  },
  {
    name: "Alicia's Set",
    description: 'The ultimate seamless workout set. High-waisted leggings and matching crop top designed for maximum comfort and flexibility. Available in multiple colors to suit your style.',
    category: 'Activewear',
    price: 45.00,
    original_price: null,
    badge: 'NEW',
    video_thumbnail_url: '/woman-wearing-black-seamless-leggings-athletic-wea.jpg',
    variants: [
      // Black Variant
      { size: 'S', color: 'Black', stock: 15, images: ['/woman-wearing-black-seamless-leggings-athletic-wea.jpg', '/black-crop-hoodie-women.jpg'] },
      { size: 'M', color: 'Black', stock: 20, images: ['/woman-wearing-black-seamless-leggings-athletic-wea.jpg', '/black-crop-hoodie-women.jpg'] },
      { size: 'L', color: 'Black', stock: 15, images: ['/woman-wearing-black-seamless-leggings-athletic-wea.jpg', '/black-crop-hoodie-women.jpg'] },
      { size: 'XL', color: 'Black', stock: 10, images: ['/woman-wearing-black-seamless-leggings-athletic-wea.jpg', '/black-crop-hoodie-women.jpg'] },
      { size: 'XXL', color: 'Black', stock: 5, images: ['/woman-wearing-black-seamless-leggings-athletic-wea.jpg', '/black-crop-hoodie-women.jpg'] },
      
      // Gray Variant
      { size: 'S', color: 'Gray', stock: 15, images: ['/woman-wearing-gray-seamless-leggings-gym.jpg', '/gray-hooded-jacket-sportswear.jpg'] },
      { size: 'M', color: 'Gray', stock: 20, images: ['/woman-wearing-gray-seamless-leggings-gym.jpg', '/gray-hooded-jacket-sportswear.jpg'] },
      { size: 'L', color: 'Gray', stock: 15, images: ['/woman-wearing-gray-seamless-leggings-gym.jpg', '/gray-hooded-jacket-sportswear.jpg'] },
      { size: 'XL', color: 'Gray', stock: 10, images: ['/woman-wearing-gray-seamless-leggings-gym.jpg', '/gray-hooded-jacket-sportswear.jpg'] },
      { size: 'XXL', color: 'Gray', stock: 5, images: ['/woman-wearing-gray-seamless-leggings-gym.jpg', '/gray-hooded-jacket-sportswear.jpg'] },

      // Navy Variant
      { size: 'S', color: 'Navy', stock: 10, images: ['/woman-wearing-navy-seamless-leggings-workout.jpg'] },
      { size: 'M', color: 'Navy', stock: 15, images: ['/woman-wearing-navy-seamless-leggings-workout.jpg'] },
      { size: 'L', color: 'Navy', stock: 10, images: ['/woman-wearing-navy-seamless-leggings-workout.jpg'] },
      { size: 'XL', color: 'Navy', stock: 5, images: ['/woman-wearing-navy-seamless-leggings-workout.jpg'] },
      { size: 'XXL', color: 'Navy', stock: 5, images: ['/woman-wearing-navy-seamless-leggings-workout.jpg'] },

      // Pink Variant
      { size: 'S', color: 'Pink', stock: 10, images: ['/pink-crop-hoodie-sportswear.jpg'] },
      { size: 'M', color: 'Pink', stock: 15, images: ['/pink-crop-hoodie-sportswear.jpg'] },
      { size: 'L', color: 'Pink', stock: 10, images: ['/pink-crop-hoodie-sportswear.jpg'] },
      { size: 'XL', color: 'Pink', stock: 5, images: ['/pink-crop-hoodie-sportswear.jpg'] },
      { size: 'XXL', color: 'Pink', stock: 5, images: ['/pink-crop-hoodie-sportswear.jpg'] },

      // Brown Variant (Placeholder/Requested)
      { size: 'S', color: 'Brown', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'M', color: 'Brown', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'L', color: 'Brown', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'XL', color: 'Brown', stock: 10, images: ['/placeholder.jpg'] },
      { size: 'XXL', color: 'Brown', stock: 10, images: ['/placeholder.jpg'] },
    ],
  },
  // Gym Socks
  {
    name: 'ASW Fit Boost Socks',
    description: 'High-performance gym socks for maximum comfort and stability.',
    category: 'Gym Socks',
    price: 8.99,
    video_thumbnail_url: '/placeholder.jpg',
    variants: [
      { size: null, color: 'Default', stock: 50, images: ['/placeholder.jpg'] },
    ],
  },
  // Bags
  {
    name: 'ASW Fitness Bag',
    description: 'Durable and spacious fitness bag for all your gear.',
    category: 'Bags',
    price: 24.99,
    video_thumbnail_url: '/placeholder.jpg',
    variants: [
      { size: null, color: 'Black', stock: 20, images: ['/placeholder.jpg'] },
    ],
  },
  // Waist Trainers
  {
    name: 'ASW Latex Waist Trainer',
    description: 'High-quality latex waist trainer for enhanced workout results.',
    category: 'Waist Trainers',
    price: 49.99,
    video_thumbnail_url: '/placeholder.jpg',
    variants: [
      { size: 'S', color: 'Black', stock: 5, images: ['/placeholder.jpg'] },
      { size: 'M', color: 'Black', stock: 5, images: ['/placeholder.jpg'] },
      { size: 'L', color: 'Black', stock: 5, images: ['/placeholder.jpg'] },
      { size: 'XL', color: 'Black', stock: 5, images: ['/placeholder.jpg'] },
      { size: 'XXL', color: 'Black', stock: 5, images: ['/placeholder.jpg'] },
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
        INSERT INTO products (name, description, category, price, video_url, video_thumbnail_url, original_price, badge, rating, reviews_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `,
        [
          p.name,
          p.description,
          p.category,
          p.price,
          p.video_url || null,
          p.video_thumbnail_url,
          p.original_price || null,
          p.badge || null,
          (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
          Math.floor(Math.random() * 50) + 1, // Random reviews count
        ]
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
