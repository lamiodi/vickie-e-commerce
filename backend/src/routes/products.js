import express from 'express';
import { pool } from '../db/pool.js';
import { logger } from '../utils/logger.js';
import { validate as isValidUUID } from 'uuid';
import { 
  upload, 
  processImage, 
  cleanupFile, 
  validateFileSize, 
  MAX_IMAGE_SIZE 
} from '../services/media.js';
import { requireAuth } from '../middleware/auth.js';
import path from 'path';

const router = express.Router();

// Helper to process product data
const processProduct = (p) => {
  const variants = p.variants || [];
  let image = null;

  // 1. Try to find first image from variants
  for (const v of variants) {
    if (v && v.images && Array.isArray(v.images) && v.images.length > 0) {
      image = v.images[0];
      break;
    }
  }

  // 2. If no variant image, check product-level images
  if (!image && p.images && Array.isArray(p.images) && p.images.length > 0) {
    image = p.images[0];
  }

  return {
    ...p,
    image,
    images: p.images || [],
    originalPrice: p.original_price ? Number(p.original_price) : null,
    rating: p.rating ? Number(p.rating) : 0,
    reviewsCount: p.reviews_count ? Number(p.reviews_count) : 0,
  };
};

// Create new product
router.post('/', requireAuth, upload.array('images', 10), async (req, res) => {
  const client = await pool.connect();

  try {
    const { name, price, description, category, badge, originalPrice } = req.body;
    const files = req.files || [];

    // Basic validation
    if (!name || !price) {
      return res.status(400).json({ error: 'missing_fields', message: 'Name and price are required' });
    }

    await client.query('BEGIN');

    // 1. Insert Product
    const insertProductSql = `
      INSERT INTO products (
        name, price, description, category, badge, original_price
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const productRes = await client.query(insertProductSql, [
      name,
      price,
      description || null,
      category || null,
      badge || null,
      originalPrice || null
    ]);
    const productId = productRes.rows[0].id;

    // 2. Process and Insert Images
    const uploadedMedia = [];
    
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            validateFileSize(file, MAX_IMAGE_SIZE);
            
            // processImage handles Cloudinary upload if env is set
            const processed = await processImage(file);
            
            // Insert into product_media
            const insertMediaSql = `
              INSERT INTO product_media (
                product_id, media_type, 
                file_path, file_size, mime_type, display_order, 
                is_primary, uploaded_by
              ) VALUES ($1, 'image', $2, $3, $4, $5, $6, $7)
              RETURNING *
            `;
            
            const mediaRes = await client.query(insertMediaSql, [
              productId,
              processed.processedPath,
              file.size,
              file.mimetype,
              i + 1,
              i === 0,
              req.user.sub
            ]);
            
            uploadedMedia.push(mediaRes.rows[0]);
            
            // Clean up local file (no-op if Cloudinary)
            await cleanupFile(file.path);
            
        } catch (err) {
            throw err;
        }
      }
    }

    await client.query('COMMIT');

    logger.info(`Product created: ${productId} with ${uploadedMedia.length} images`);

    res.status(201).json({
      success: true,
      product: {
        id: productId,
        name,
        price,
        description,
        category,
        badge,
        originalPrice,
        images: uploadedMedia.map(m => m.file_path)
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Failed to create product:', error);
    
    // Attempt cleanup of any files on error
    if (req.files) {
        for (const file of req.files) {
            try { await cleanupFile(file.path); } catch (e) {}
        }
    }

    res.status(500).json({
      error: 'create_failed',
      message: 'Failed to create product'
    });
  } finally {
    client.release();
  }
});

// Recommended products endpoint
router.get('/recommended', async (req, res) => {
  try {
    // Simple logic: get 4 random products
    const { rows } = await pool.query(`
      SELECT p.*, 
             json_agg(DISTINCT v.*) FILTER (WHERE v.id IS NOT NULL) AS variants,
             json_agg(DISTINCT pm.file_path) FILTER (WHERE pm.file_path IS NOT NULL) AS images
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
      LEFT JOIN product_media pm ON pm.product_id=p.id AND pm.media_type='image'
      GROUP BY p.id 
      ORDER BY RANDOM() 
      LIMIT 4
    `);
    res.json(rows.map(processProduct));
  } catch (error) {
    logger.error('Error fetching recommended products', { error: error.message });
    res.status(500).json({ error: 'internal_server_error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { q, category, gender, min, max, sort, page = 1, limit = 12, include_videos = false } = req.query;
    const params = [];
    const where = [];

    if (q) {
      params.push(`%${q}%`);
      where.push(`p.name ILIKE $${params.length}`);
    }
    if (category) {
      params.push(category);
      where.push(`p.category = $${params.length}`);
    }
    if (gender) {
      params.push(gender);
      where.push(`p.gender = $${params.length}`);
    }
    if (min) {
      params.push(min);
      where.push(`p.price >= $${params.length}`);
    }
    if (max) {
      params.push(max);
      where.push(`p.price <= $${params.length}`);
    }

    // Count query params (exclude limit and offset)
    const countParams = [...params];

    const limitNum = parseInt(limit) > 0 ? parseInt(limit) : 12;
    const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
    const offset = (pageNum - 1) * limitNum;
    params.push(limitNum);
    params.push(offset);

    const order =
      sort === 'price_asc'
        ? 'p.price ASC'
        : sort === 'price_desc'
          ? 'p.price DESC'
          : 'p.created_at DESC';

    const sql = `
      SELECT p.*, 
             json_agg(DISTINCT v.*) FILTER (WHERE v.id IS NOT NULL) AS variants,
             json_agg(DISTINCT pm.file_path) FILTER (WHERE pm.file_path IS NOT NULL) AS images
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
      LEFT JOIN product_media pm ON pm.product_id=p.id AND pm.media_type='image'
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''} 
      GROUP BY p.id 
      ORDER BY ${order} 
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

    const { rows } = await pool.query(sql, params);

    // Get total count
    const countSql = `
      SELECT COUNT(DISTINCT p.id)
      FROM products p 
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''} 
    `;
    const countRes = await pool.query(countSql, countParams);
    const total = parseInt(countRes.rows[0].count);

    // Log successful request
    logger.info(`Products list retrieved`, {
      count: rows.length,
      total,
      query: req.query,
    });

    res.json({
      products: rows.map(processProduct),
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    logger.error('Error fetching products', { error: error.message, query: req.query });
    res.status(500).json({
      error: 'internal_server_error',
      message: 'Failed to fetch products',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate UUID format (Generic UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: 'invalid_id',
        message: 'Invalid product ID format',
      });
    }

    const sql = `
      SELECT p.*, 
             json_agg(DISTINCT v.*) FILTER (WHERE v.id IS NOT NULL) AS variants,
             json_agg(DISTINCT pm.file_path) FILTER (WHERE pm.file_path IS NOT NULL) AS images
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
      LEFT JOIN product_media pm ON pm.product_id=p.id AND pm.media_type='image'
      WHERE p.id=$1 
      GROUP BY p.id
    `;

    const { rows } = await pool.query(sql, [id]);

    if (!rows.length) {
      logger.warn('Product not found', { productId: id });
      return res.status(404).json({
        error: 'not_found',
        message: 'Product not found',
      });
    }

    const product = processProduct(rows[0]);

    // Extract sizes and colors
    const sizes = new Set();
    const colors = new Set();

    if (rows[0].variants) {
      rows[0].variants.forEach((v) => {
        if (v && v.size) sizes.add(v.size);
        if (v && v.color) colors.add(v.color);
      });
    }

    product.sizes = Array.from(sizes);
    product.colors = Array.from(colors).map((c) => ({ name: c }));
    product.originalPrice = product.original_price ? Number(product.original_price) : null;
    product.rating = product.rating ? Number(product.rating) : 0;
    product.reviewsCount = product.reviews_count ? Number(product.reviews_count) : 0;

    res.json(product);
  } catch (error) {
    logger.error('Error fetching product', { error: error.message, productId: req.params.id });
    res.status(500).json({
      error: 'internal_server_error',
      message: 'Failed to fetch product details',
    });
  }
});

export default router;
