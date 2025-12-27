import express from 'express';
import path from 'path';
import { pool } from '../db/pool.js';
import {
  upload,
  processImage,
  processVideo,
  cleanupFile,
  getFileType,
  validateFileSize,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from '../services/media.js';
import { logger } from '../utils/logger.js';
import { requireAuth } from '../middleware/auth.js';

import { validate as isValidUUID } from 'uuid';

const router = express.Router();

// Upload media for a product
router.post(
  '/products/:productId/media',
  requireAuth,
  upload.array('media', 10),
  async (req, res, next) => {
    try {
      const { productId } = req.params;
      
      if (!isValidUUID(productId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid product ID format' }
        });
      }

      const files = req.files;
      const { variantId, altText, caption } = req.body;

      if (!files || files.length === 0) {
        return res.status(400).json({
          error: 'no_files',
          message: 'No files uploaded',
        });
      }

      // Verify product exists
      const productResult = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);

      if (productResult.rows.length === 0) {
        // Clean up uploaded files
        for (const file of files) {
          await cleanupFile(file.path);
        }
        return res.status(404).json({
          error: 'product_not_found',
          message: 'Product not found',
        });
      }

      const uploadedMedia = [];
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        for (const file of files) {
          try {
            const fileType = getFileType(file.mimetype);
            let processedResult;

            if (fileType === 'image') {
              validateFileSize(file, MAX_IMAGE_SIZE); // Handled by multer limits
              processedResult = await processImage(file);

              // Clean up original file after processing (no-op for Cloudinary)
              await cleanupFile(file.path);
            } else if (fileType === 'video') {
              validateFileSize(file, MAX_VIDEO_SIZE); // Handled by multer limits
              processedResult = await processVideo(file);

              // Clean up original file after processing (no-op for Cloudinary)
              await cleanupFile(file.path);
            } else {
              await cleanupFile(file.path);
              throw new Error(`Unsupported file type: ${file.mimetype}`);
            }

            // Get next display order
            const orderResult = await client.query(
              'SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM product_media WHERE product_id = $1',
              [productId]
            );
            const nextOrder = orderResult.rows[0].next_order;

            // Insert media record
            const insertResult = await client.query(
              `INSERT INTO product_media (
                product_id, variant_id, media_type, 
                file_path, file_size, mime_type, width, height, duration, 
                thumbnail_path, alt_text, caption, display_order, uploaded_by
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
              RETURNING *`,
              [
                productId,
                variantId || null,
                fileType,
                processedResult.processedPath,
                processedResult.size,
                file.mimetype,
                processedResult.width || null,
                processedResult.height || null,
                processedResult.duration || null,
                processedResult.thumbnailPath || null,
                altText || null,
                caption || null,
                nextOrder,
                req.user.id,
              ]
            );

            uploadedMedia.push(insertResult.rows[0]);
          } catch (error) {
            logger.error(`Failed to process file ${file.originalname}:`, error);
            // Clean up any partially processed files
            try {
              await cleanupFile(file.path);
            } catch (cleanupError) {
              logger.error('Failed to cleanup file:', cleanupError);
            }
          }
        }

        await client.query('COMMIT');

        if (uploadedMedia.length === 0) {
          return res.status(400).json({
            error: 'upload_failed',
            message: 'No files were successfully uploaded. Check file types and sizes.',
          });
        }

        logger.info(
          `Successfully uploaded ${uploadedMedia.length} media files for product ${productId}`
        );

        res.json({
          success: true,
          uploaded: uploadedMedia.length,
          media: uploadedMedia.map((media) => ({
            id: media.id,
            mediaType: media.media_type,
            filePath: media.file_path,
            thumbnailPath: media.thumbnail_path,
            displayOrder: media.display_order,
            width: media.width,
            height: media.height,
            duration: media.duration,
          })),
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Media upload failed:', error);
      res.status(500).json({
        error: 'upload_failed',
        message: 'Failed to upload media files',
      });
    }
  }
);

// Get media for a product
router.get('/products/:productId/media', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidUUID(productId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid product ID format' }
      });
    }

    const { type } = req.query;

    let query = `
      SELECT 
        pm.*,
        u.name as uploaded_by_name,
        v.color as variant_color,
        v.size as variant_size
      FROM product_media pm
      LEFT JOIN users u ON pm.uploaded_by = u.id
      LEFT JOIN product_variants v ON pm.variant_id = v.id
      WHERE pm.product_id = $1 AND pm.is_active = true
    `;

    const params = [productId];

    if (type) {
      query += ` AND pm.media_type = $2`;
      params.push(type);
    }

    query += ` ORDER BY pm.display_order ASC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      media: result.rows.map((media) => ({
        id: media.id,
        mediaType: media.media_type,
        filePath: media.file_path,
        thumbnailPath: media.thumbnail_path,
        originalName: media.original_name,
        fileSize: media.file_size,
        width: media.width,
        height: media.height,
        duration: media.duration,
        altText: media.alt_text,
        caption: media.caption,
        displayOrder: media.display_order,
        isPrimary: media.is_primary,
        uploadedAt: media.created_at,
        uploadedBy: media.uploaded_by_name,
        variantId: media.variant_id,
        variantColor: media.variant_color,
        variantSize: media.variant_size,
      })),
    });
  } catch (error) {
    logger.error('Failed to fetch product media:', error);
    res.status(500).json({
      error: 'fetch_failed',
      message: 'Failed to fetch product media',
    });
  }
});

// Update media metadata
router.patch('/media/:mediaId', requireAuth, async (req, res) => {
  try {
    const { mediaId } = req.params;
    const { altText, caption, displayOrder, isPrimary } = req.body;

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (altText !== undefined) {
      updates.push(`alt_text = $${paramIndex}`);
      params.push(altText);
      paramIndex++;
    }

    if (caption !== undefined) {
      updates.push(`caption = $${paramIndex}`);
      params.push(caption);
      paramIndex++;
    }

    if (displayOrder !== undefined) {
      updates.push(`display_order = $${paramIndex}`);
      params.push(displayOrder);
      paramIndex++;
    }

    if (isPrimary !== undefined) {
      if (isPrimary) {
        const primaryResult = await pool.query(
          'SELECT product_id FROM product_media WHERE id = $1',
          [mediaId]
        );

        if (primaryResult.rows.length > 0) {
          const productId = primaryResult.rows[0].product_id;
          await pool.query(
            'UPDATE product_media SET is_primary = false WHERE product_id = $1 AND id != $2',
            [productId, mediaId]
          );
        }
      }

      updates.push(`is_primary = $${paramIndex}`);
      params.push(isPrimary);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'no_updates',
        message: 'No valid fields to update',
      });
    }

    params.push(mediaId);

    const result = await pool.query(
      `UPDATE product_media SET ${updates.join(', ')}, updated_at = NOW() 
       WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'media_not_found',
        message: 'Media not found',
      });
    }

    logger.info(`Media ${mediaId} updated by user ${req.user.id}`);

    res.json({
      success: true,
      media: result.rows[0],
    });
  } catch (error) {
    logger.error('Failed to update media:', error);
    res.status(500).json({
      error: 'update_failed',
      message: 'Failed to update media',
    });
  }
});

// Reorder media for a product
router.post('/products/:productId/media/reorder', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { mediaOrder } = req.body;

    if (!Array.isArray(mediaOrder) || mediaOrder.length === 0) {
      return res.status(400).json({
        error: 'invalid_order',
        message: 'Media order must be a non-empty array',
      });
    }

    // Validate that all media IDs exist and belong to the product
    const mediaResult = await pool.query(
      'SELECT id FROM product_media WHERE product_id = $1 AND id = ANY($2) AND is_active = true',
      [productId, mediaOrder]
    );

    if (mediaResult.rows.length !== mediaOrder.length) {
      return res.status(400).json({
        error: 'invalid_media_ids',
        message: 'Some media IDs are invalid or do not belong to this product',
      });
    }

    // Update display order for each media item
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (let i = 0; i < mediaOrder.length; i++) {
        await client.query(
          'UPDATE product_media SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [i + 1, mediaOrder[i]]
        );
      }

      await client.query('COMMIT');

      logger.info(`Media reordered for product ${productId} by user ${req.user.id}`);

      res.json({
        success: true,
        message: 'Media order updated successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Failed to reorder media:', error);
    res.status(500).json({
      error: 'reorder_failed',
      message: 'Failed to reorder media',
    });
  }
});

// Delete media
router.delete('/media/:mediaId', requireAuth, async (req, res) => {
  try {
    const { mediaId } = req.params;

    if (!isValidUUID(mediaId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid media ID format' }
      });
    }

    // Soft delete (set is_active to false)
    const result = await pool.query(
      'UPDATE product_media SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [mediaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'media_not_found',
        message: 'Media not found',
      });
    }

    logger.info(`Media ${mediaId} deleted by user ${req.user.id}`);

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete media:', error);
    res.status(500).json({
      error: 'delete_failed',
      message: 'Failed to delete media',
    });
  }
});

export default router;
