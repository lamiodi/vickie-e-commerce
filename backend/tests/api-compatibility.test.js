import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database pool
jest.unstable_mockModule('../src/db/pool.js', () => ({
  pool: { 
    query: jest.fn(),
    connect: jest.fn()
  }
}));

const { pool } = await import('../src/db/pool.js');
const { default: app } = await import('../src/app.js');

describe('API Backward Compatibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/products (List endpoint)', () => {
    it('should return products without video fields when include_videos is not specified', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          images: ['image1.jpg', 'image2.jpg'],
          variants: []
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProducts });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).not.toHaveProperty('video_url');
      expect(response.body[0]).not.toHaveProperty('video_position');
      expect(response.body[0]).not.toHaveProperty('video_duration');
      expect(response.body[0]).toHaveProperty('name', 'Test Product');
      expect(response.body[0]).toHaveProperty('price', 99.99);
      expect(response.body[0]).toHaveProperty('images');
    });

    it('should return products without video fields when include_videos=false', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          images: ['image1.jpg', 'image2.jpg'],
          variants: []
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProducts });

      const response = await request(app)
        .get('/api/products?include_videos=false')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).not.toHaveProperty('video_url');
      expect(response.body[0]).not.toHaveProperty('video_position');
      expect(response.body[0]).not.toHaveProperty('video_duration');
    });

    it('should return products with video fields when include_videos=true', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          images: ['image1.jpg', 'image2.jpg'],
          variants: [],
          video_url: 'https://example.com/video.mp4',
          video_position: 1,
          video_duration: 120,
          video_format: 'mp4',
          video_width: 1920,
          video_height: 1080,
          video_thumbnail_url: 'https://example.com/video-thumb.jpg',
          video_file_size: 5242880,
          video_is_external: true
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProducts });

      const response = await request(app)
        .get('/api/products?include_videos=true')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('video_url', 'https://example.com/video.mp4');
      expect(response.body[0]).toHaveProperty('video_position', 1);
      expect(response.body[0]).toHaveProperty('video_duration', 120);
      expect(response.body[0]).toHaveProperty('video_format', 'mp4');
      expect(response.body[0]).toHaveProperty('video_width', 1920);
      expect(response.body[0]).toHaveProperty('video_height', 1080);
    });

    it('should maintain existing query parameter functionality', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          category: 'electronics',
          images: ['image1.jpg'],
          variants: []
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProducts });

      // Test with existing parameters
      const response = await request(app)
        .get('/api/products?q=Test&category=electronics&min=50&max=200&sort=price_asc&page=1&limit=10')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('name', 'Test Product');
      expect(response.body[0]).toHaveProperty('price', 99.99);
      expect(response.body[0]).toHaveProperty('category', 'electronics');
    });
  });

  describe('GET /api/products/:id (Detail endpoint)', () => {
    it('should return product with video fields by default (backward compatible)', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 99.99,
        images: ['image1.jpg', 'image2.jpg'],
        variants: [],
        video_url: 'https://example.com/video.mp4',
        video_position: 1,
        video_duration: 120,
        video_format: 'mp4',
        video_width: 1920,
        video_height: 1080,
        video_thumbnail_url: 'https://example.com/video-thumb.jpg',
        video_file_size: 5242880,
        video_is_external: true
      };

      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      // By default, single product view includes video data
      expect(response.body).toHaveProperty('video_url', 'https://example.com/video.mp4');
      expect(response.body).toHaveProperty('video_position', 1);
      expect(response.body).toHaveProperty('video_duration', 120);
      expect(response.body).toHaveProperty('name', 'Test Product');
      expect(response.body).toHaveProperty('price', 99.99);
    });

    it('should return product without video fields when include_videos=false', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        price: 99.99,
        images: ['image1.jpg', 'image2.jpg'],
        variants: [],
        video_url: 'https://example.com/video.mp4',
        video_position: 1,
        video_duration: 120,
        video_format: 'mp4'
      };

      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/1?include_videos=false')
        .expect(200);

      expect(response.body).not.toHaveProperty('video_url');
      expect(response.body).not.toHaveProperty('video_position');
      expect(response.body).not.toHaveProperty('video_duration');
      expect(response.body).toHaveProperty('name', 'Test Product');
      expect(response.body).toHaveProperty('price', 99.99);
    });

    it('should handle invalid product ID format gracefully', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'invalid_id');
      expect(response.body).toHaveProperty('message', 'Invalid product ID format');
    });

    it('should return 404 for non-existent product', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/api/products/99999999-9999-9999-9999-999999999999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'not_found');
      expect(response.body).toHaveProperty('message', 'Product not found');
    });
  });

  describe('Response Structure Compatibility', () => {
    it('should maintain consistent response structure for existing fields', async () => {
      const mockProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Product description',
        price: 99.99,
        category: 'electronics',
        images: ['image1.jpg', 'image2.jpg'],
        stock: 10,
        variants: [
          {
            id: 'v1',
            name: 'Red Variant',
            price: 99.99,
            stock: 5
          }
        ]
      };

      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/1?include_videos=false')
        .expect(200);

      // Verify all existing fields are present
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('images');
      expect(response.body).toHaveProperty('stock');
      expect(response.body).toHaveProperty('variants');
      
      // Verify variants structure
      expect(Array.isArray(response.body.variants)).toBe(true);
      expect(response.body.variants[0]).toHaveProperty('id');
      expect(response.body.variants[0]).toHaveProperty('name');
      expect(response.body.variants[0]).toHaveProperty('price');
      expect(response.body.variants[0]).toHaveProperty('stock');
    });
  });

  describe('Error Response Compatibility', () => {
    it('should maintain consistent error response format', async () => {
      pool.query.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'internal_server_error');
      expect(response.body).toHaveProperty('message', 'Failed to fetch products');
    });

    it('should maintain consistent error format for single product endpoint', async () => {
      pool.query.mockRejectedValue(new Error('Database connection error'));

      const response = await request(app)
        .get('/api/products/1')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'internal_server_error');
      expect(response.body).toHaveProperty('message', 'Failed to fetch product details');
    });
  });
});