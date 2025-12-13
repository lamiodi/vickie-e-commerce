/**
 * Comprehensive tests for media management functionality
 * Tests image/video upload, processing, validation, and management
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/db/pool.js';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

describe('Media Management API Tests', () => {
  let authToken;
  let testProductId;
  let testUserId;

  beforeEach(async () => {
    // Create a test user and get auth token
    const userResult = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['test@example.com', 'hashedpassword', 'Test User', 'admin']
    );
    testUserId = userResult.rows[0].id;

    // Mock auth token (in real tests, you'd use actual JWT generation)
    authToken = 'mock-jwt-token';

    // Create a test product
    const productResult = await pool.query(
      'INSERT INTO products (name, description, category, price, attributes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Test Product', 'Test Description', 'Test Category', 99.99, '{}']
    );
    testProductId = productResult.rows[0].id;
  });

  afterEach(async () => {
    // Clean up test data
    await pool.query('DELETE FROM product_media WHERE product_id = $1', [testProductId]);
    await pool.query('DELETE FROM products WHERE id = $1', [testProductId]);
    await pool.query('DELETE FROM users WHERE id = $1', [testUserId]);
  });

  describe('POST /api/media/products/{productId}/media', () => {
    it('should upload multiple image files successfully', async () => {
      // Create test image files
      // const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');
      const testImageBuffer = Buffer.from('fake-image-data');

      // Mock file upload (in real tests, you'd use actual file buffers)
      const response = await request(app)
        .post(`/api/media/products/${testProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('media', testImageBuffer, 'test-image.jpg')
        .attach('media', testImageBuffer, 'test-image2.jpg')
        .field('altText', 'Test image alt text')
        .field('caption', 'Test image caption');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.uploaded).toBe(2);
      expect(response.body.media).toHaveLength(2);
      expect(response.body.media[0].mediaType).toBe('image');
    });

    it('should validate file type and reject unsupported formats', async () => {
      const response = await request(app)
        .post(`/api/media/products/${testProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('media', Buffer.from('fake-text-data'), 'test.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('invalid_file_type');
    });

    it('should validate file size limits', async () => {
      // Create a large file buffer that exceeds size limits
      const largeBuffer = Buffer.alloc(15 * 1024 * 1024); // 15MB

      const response = await request(app)
        .post(`/api/media/products/${testProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('media', largeBuffer, 'large-image.jpg');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('file_too_large');
    });

    it('should handle product not found error', async () => {
      const nonExistentProductId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .post(`/api/media/products/${nonExistentProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('media', Buffer.from('fake-image-data'), 'test.jpg');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('product_not_found');
    });

    it('should handle no files uploaded error', async () => {
      const response = await request(app)
        .post(`/api/media/products/${testProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('no_files');
    });
  });

  describe('GET /api/media/products/{productId}/media', () => {
    beforeEach(async () => {
      // Add some test media
      await pool.query(
        `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          testProductId,
          'image',
          'test1.jpg',
          'Test Image 1',
          '/uploads/test1.jpg',
          1024,
          'image/jpeg',
          1,
          testUserId,
        ]
      );
      await pool.query(
        `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          testProductId,
          'video',
          'test1.mp4',
          'Test Video 1',
          '/uploads/test1.mp4',
          2048,
          'video/mp4',
          2,
          testUserId,
        ]
      );
    });

    it('should retrieve all media for a product', async () => {
      const response = await request(app)
        .get(`/api/media/products/${testProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.media).toHaveLength(2);
      expect(response.body.media[0].mediaType).toBe('image');
      expect(response.body.media[1].mediaType).toBe('video');
    });

    it('should filter media by type', async () => {
      const response = await request(app)
        .get(`/api/media/products/${testProductId}/media?type=image`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.media).toHaveLength(1);
      expect(response.body.media[0].mediaType).toBe('image');
    });

    it('should order media by display_order', async () => {
      const response = await request(app)
        .get(`/api/media/products/${testProductId}/media`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.media[0].displayOrder).toBe(1);
      expect(response.body.media[1].displayOrder).toBe(2);
    });
  });

  describe('PATCH /api/media/media/{mediaId}', () => {
    let mediaId;

    beforeEach(async () => {
      const mediaResult = await pool.query(
        `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          testProductId,
          'image',
          'test.jpg',
          'Test Image',
          '/uploads/test.jpg',
          1024,
          'image/jpeg',
          1,
          testUserId,
        ]
      );
      mediaId = mediaResult.rows[0].id;
    });

    it('should update media metadata', async () => {
      const response = await request(app)
        .patch(`/api/media/media/${mediaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          altText: 'Updated alt text',
          caption: 'Updated caption',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.media.alt_text).toBe('Updated alt text');
      expect(response.body.media.caption).toBe('Updated caption');
    });

    it('should set media as primary and unset others', async () => {
      // Add another media item
      const otherMediaResult = await pool.query(
        `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by, is_primary) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          testProductId,
          'image',
          'test2.jpg',
          'Test Image 2',
          '/uploads/test2.jpg',
          1024,
          'image/jpeg',
          2,
          testUserId,
          true,
        ]
      );

      const response = await request(app)
        .patch(`/api/media/media/${mediaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ isPrimary: true });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify the other media is no longer primary
      const otherMediaCheck = await pool.query(
        'SELECT is_primary FROM product_media WHERE id = $1',
        [otherMediaResult.rows[0].id]
      );
      expect(otherMediaCheck.rows[0].is_primary).toBe(false);
    });

    it('should handle media not found error', async () => {
      const nonExistentMediaId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .patch(`/api/media/media/${nonExistentMediaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ altText: 'Updated alt text' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('media_not_found');
    });
  });

  describe('POST /api/media/products/{productId}/media/reorder', () => {
    let mediaIds = [];

    beforeEach(async () => {
      // Create test media items
      for (let i = 1; i <= 3; i++) {
        const mediaResult = await pool.query(
          `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
          [
            testProductId,
            'image',
            `test${i}.jpg`,
            `Test Image ${i}`,
            `/uploads/test${i}.jpg`,
            1024,
            'image/jpeg',
            i,
            testUserId,
          ]
        );
        mediaIds.push(mediaResult.rows[0].id);
      }
    });

    it('should reorder media successfully', async () => {
      // Reorder: move last item to first position
      const newOrder = [mediaIds[2], mediaIds[0], mediaIds[1]];

      const response = await request(app)
        .post(`/api/media/products/${testProductId}/media/reorder`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ mediaOrder: newOrder });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify the new order
      const mediaResult = await pool.query(
        'SELECT id, display_order FROM product_media WHERE product_id = $1 ORDER BY display_order ASC',
        [testProductId]
      );

      expect(mediaResult.rows[0].id).toBe(mediaIds[2]);
      expect(mediaResult.rows[0].display_order).toBe(1);
      expect(mediaResult.rows[1].id).toBe(mediaIds[0]);
      expect(mediaResult.rows[1].display_order).toBe(2);
      expect(mediaResult.rows[2].id).toBe(mediaIds[1]);
      expect(mediaResult.rows[2].display_order).toBe(3);
    });

    it('should validate media IDs belong to product', async () => {
      // Create media for different product
      const otherProductResult = await pool.query(
        'INSERT INTO products (name, description, category, price, attributes) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        ['Other Product', 'Other Description', 'Other Category', 199.99, '{}']
      );
      const otherProductId = otherProductResult.rows[0].id;

      const otherMediaResult = await pool.query(
        `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          otherProductId,
          'image',
          'other.jpg',
          'Other Image',
          '/uploads/other.jpg',
          1024,
          'image/jpeg',
          1,
          testUserId,
        ]
      );
      const otherMediaId = otherMediaResult.rows[0].id;

      const response = await request(app)
        .post(`/api/media/products/${testProductId}/media/reorder`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ mediaOrder: [mediaIds[0], otherMediaId] });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('invalid_media_ids');

      // Clean up
      await pool.query('DELETE FROM product_media WHERE product_id = $1', [otherProductId]);
      await pool.query('DELETE FROM products WHERE id = $1', [otherProductId]);
    });
  });

  describe('DELETE /api/media/media/{mediaId}', () => {
    let mediaId;

    beforeEach(async () => {
      const mediaResult = await pool.query(
        `INSERT INTO product_media (product_id, media_type, file_name, original_name, file_path, file_size, mime_type, display_order, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          testProductId,
          'image',
          'test.jpg',
          'Test Image',
          '/uploads/test.jpg',
          1024,
          'image/jpeg',
          1,
          testUserId,
        ]
      );
      mediaId = mediaResult.rows[0].id;
    });

    it('should soft delete media successfully', async () => {
      const response = await request(app)
        .delete(`/api/media/media/${mediaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify media is marked as inactive
      const mediaCheck = await pool.query('SELECT is_active FROM product_media WHERE id = $1', [
        mediaId,
      ]);
      expect(mediaCheck.rows[0].is_active).toBe(false);
    });

    it('should handle media not found error', async () => {
      const nonExistentMediaId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .delete(`/api/media/media/${nonExistentMediaId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('media_not_found');
    });
  });

  describe('Security Tests', () => {
    it('should require authentication for all endpoints', async () => {
      const endpoints = [
        { method: 'post', path: `/api/media/products/${testProductId}/media` },
        { method: 'get', path: `/api/media/products/${testProductId}/media` },
        { method: 'patch', path: '/api/media/media/00000000-0000-0000-0000-000000000000' },
        { method: 'post', path: `/api/media/products/${testProductId}/media/reorder` },
        { method: 'delete', path: '/api/media/media/00000000-0000-0000-0000-000000000000' },
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path);
        expect(response.status).toBe(401); // Unauthorized
      }
    });

    it('should validate UUID format in path parameters', async () => {
      const invalidUuids = ['invalid-uuid', '123', ''];

      for (const invalidUuid of invalidUuids) {
        const response = await request(app)
          .get(`/api/media/products/${invalidUuid}/media`)
          .set('Authorization', `Bearer ${authToken}`);

        // Should either return 400 (Bad Request) or 404 (Not Found)
        expect([400, 404]).toContain(response.status);
      }
    });
  });
});
