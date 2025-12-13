import express from 'express';
import { pool } from '../db/pool.js';
import { validateVideoURL } from '../utils/validation.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Helper to process product data
const processProduct = (p) => {
  const variants = p.variants || [];
  let image = p.video_thumbnail_url || null;

  // Try to find first image from variants if no thumbnail
  if (!image) {
    for (const v of variants) {
      if (v && v.images && Array.isArray(v.images) && v.images.length > 0) {
        image = v.images[0];
        break;
      }
    }
  } else if (variants.length > 0 && variants[0].images && variants[0].images.length > 0) {
    // Prefer variant image over generic thumbnail for product card?
    // Actually usually thumbnail is better if set, but let's check.
    // If thumbnail is just a placeholder, variant image is better.
    // Let's keep thumbnail if present.
  }

  // If still no image, use first variant image regardless
  if (!image && variants.length > 0) {
    const v = variants.find((v) => v.images && v.images.length > 0);
    if (v) image = v.images[0];
  }

  return {
    ...p,
    image,
    originalPrice: p.original_price ? Number(p.original_price) : null,
    rating: p.rating ? Number(p.rating) : 0,
    reviewsCount: p.reviews_count ? Number(p.reviews_count) : 0,
  };
};

// Recommended products endpoint
router.get('/recommended', async (req, res) => {
  try {
    // Simple logic: get 4 random products
    const { rows } = await pool.query(`
      SELECT p.*, json_agg(v.*) AS variants
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
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
    const { q, category, min, max, sort, page = 1, limit = 12, include_videos = false } = req.query;
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

    // Build video fields selection based on include_videos parameter
    const videoFields =
      include_videos === 'true'
        ? `, p.video_url, p.video_position, p.video_duration, p.video_format, p.video_width, p.video_height, p.video_thumbnail_url, p.video_file_size, p.video_is_external`
        : '';

    const sql = `
      SELECT p.*, json_agg(v.*) AS variants${videoFields} 
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
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
      include_videos: include_videos === 'true',
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
    const { include_videos = 'true' } = req.query; // Default to true for single product view

    // Validate UUID format (UUID v4)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({
        error: 'invalid_id',
        message: 'Invalid product ID format',
      });
    }

    // Build video fields selection
    const videoFields =
      include_videos === 'true'
        ? `, p.video_url, p.video_position, p.video_duration, p.video_format, p.video_width, p.video_height, 
         p.video_thumbnail_url, p.video_file_size, p.video_is_external`
        : '';

    const sql = `
      SELECT p.*, json_agg(v.*) AS variants${videoFields}
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
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

    const product = rows[0];

    // Process video data if present
    if (include_videos === 'true' && product.video_url) {
      const videoValidation = validateVideoURL(product.video_url);

      if (!videoValidation.isValid) {
        logger.warn('Invalid video URL found for product', {
          productId: id,
          url: product.video_url,
        });
      }
    }

    // Enhance product data for UI
    const variants = product.variants || [];
    const allImages = new Set();
    // Add main thumbnail if exists
    if (product.video_thumbnail_url) allImages.add(product.video_thumbnail_url);

    // Add variant images
    variants.forEach((v) => {
      if (v && v.images && Array.isArray(v.images)) {
        v.images.forEach((img) => allImages.add(img));
      }
    });

    product.images = Array.from(allImages);

    // Extract sizes and colors
    const sizes = new Set();
    const colors = new Set();

    variants.forEach((v) => {
      if (v && v.size) sizes.add(v.size);
      if (v && v.color) colors.add(v.color);
    });

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
