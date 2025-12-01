import express from "express";
import { pool } from "../db/pool.js";
import { validateVideoURL } from "../utils/validation.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Recommended products endpoint
router.get("/recommended", async (req, res) => {
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
    res.json(rows);
  } catch (error) {
    logger.error('Error fetching recommended products', { error: error.message });
    res.status(500).json({ error: 'internal_server_error' });
  }
});

router.get("/", async (req, res) => {
  try {
    const { q, category, min, max, sort, page = 1, limit = 12, include_videos = false } = req.query;
    const params = [];
    const where = [];
    
    if (q) { params.push(`%${q}%`); where.push(`p.name ILIKE $${params.length}`); }
    if (category) { params.push(category); where.push(`p.category = $${params.length}`); }
    if (min) { params.push(min); where.push(`p.price >= $${params.length}`); }
    if (max) { params.push(max); where.push(`p.price <= $${params.length}`); }
    
    const offset = (Number(page) - 1) * Number(limit);
    params.push(limit); params.push(offset);
    
    const order = sort === "price_asc" ? "p.price ASC" : sort === "price_desc" ? "p.price DESC" : "p.created_at DESC";
    
    // Build video fields selection based on include_videos parameter
    const videoFields = include_videos === 'true' 
      ? `, p.video_url, p.video_position, p.video_duration, p.video_format, p.video_width, p.video_height, p.video_thumbnail_url, p.video_file_size, p.video_is_external`
      : '';
    
    const sql = `
      SELECT p.*, json_agg(v.*) AS variants${videoFields} 
      FROM products p 
      LEFT JOIN product_variants v ON v.product_id=p.id 
      ${where.length ? "WHERE " + where.join(" AND ") : ""} 
      GROUP BY p.id 
      ORDER BY ${order} 
      LIMIT $${params.length-1} OFFSET $${params.length}
    `;
    
    const { rows } = await pool.query(sql, params);
    
    // Log successful request
    logger.info(`Products list retrieved`, { 
      count: rows.length, 
      include_videos: include_videos === 'true',
      query: req.query 
    });
    
    res.json(rows);
  } catch (error) {
    logger.error('Error fetching products', { error: error.message, query: req.query });
    res.status(500).json({ 
      error: 'internal_server_error',
      message: 'Failed to fetch products' 
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { include_videos = 'true' } = req.query; // Default to true for single product view
    
    // Validate UUID format (UUID v4)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ 
        error: 'invalid_id',
        message: 'Invalid product ID format' 
      });
    }

    // Build video fields selection
    const videoFields = include_videos === 'true' 
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
        message: 'Product not found' 
      });
    }

    const product = rows[0];

    // Process video data if present
    if (include_videos === 'true' && product.video_url) {
      const videoValidation = validateVideoURL(product.video_url);
      
      if (!videoValidation.isValid) {
        logger.warn('Invalid video URL found for product', { productId: id, url: product.video_url });
        // We don't fail the request, but we could flag it or strip the invalid URL
        // product.video_url = null; // Optional: strict mode
      }
    }

    res.json(product);
  } catch (error) {
    logger.error('Error fetching product', { error: error.message, productId: req.params.id });
    res.status(500).json({ 
      error: 'internal_server_error',
      message: 'Failed to fetch product details' 
    });
  }
});

export default router;
