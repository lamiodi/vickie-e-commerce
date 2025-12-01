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

describe('Video Integration Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Response Time Impact', () => {
    it('should maintain acceptable response time for products list without videos', async () => {
      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Product ${i + 1}`,
        price: 99.99 + i,
        images: [`image${i}.jpg`],
        variants: []
      }));

      pool.query.mockResolvedValue({ rows: mockProducts });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(500); // Should respond within 500ms
    });

    it('should maintain acceptable response time for products list with videos', async () => {
      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Product ${i + 1}`,
        price: 99.99 + i,
        images: [`image${i}.jpg`],
        variants: [],
        video_url: `https://example.com/video${i}.mp4`,
        video_position: 1,
        video_duration: 120 + i,
        video_format: 'mp4',
        video_width: 1920,
        video_height: 1080,
        video_thumbnail_url: `https://example.com/video-thumb${i}.jpg`,
        video_file_size: 5242880,
        video_is_external: true
      }));

      pool.query.mockResolvedValue({ rows: mockProducts });

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/products?include_videos=true')
        .expect(200);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(20);
      expect(endTime - startTime).toBeLessThan(600); // Should respond within 600ms even with videos
    });

    it('should maintain acceptable response time for single product with video', async () => {
      const mockProduct = {
        id: '550e8400-e29b-41d4-a716-446655440001',
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

      const startTime = Date.now();
      const response = await request(app)
        .get('/api/products/550e8400-e29b-41d4-a716-446655440001')
        .expect(200);
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('video_url');
      expect(endTime - startTime).toBeLessThan(300); // Should respond within 300ms
    });
  });

  describe('Database Query Performance', () => {
    it('should handle video field selection efficiently', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Test Product',
          price: 99.99,
          images: ['image1.jpg'],
          variants: [],
          video_url: 'https://example.com/video.mp4',
          video_position: 1,
          video_duration: 120,
          video_format: 'mp4'
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProducts });

      // Test with video fields
      const responseWithVideos = await request(app)
        .get('/api/products?include_videos=true')
        .expect(200);

      expect(responseWithVideos.body[0]).toHaveProperty('video_url');
      expect(responseWithVideos.body[0]).toHaveProperty('video_duration');

      // Verify the SQL query was called with video fields
      expect(pool.query).toHaveBeenCalled();
      const sqlCall = pool.query.mock.calls[0][0];
      expect(sqlCall).toContain('video_url');
      expect(sqlCall).toContain('video_duration');
    });

    it('should exclude video fields when not requested', async () => {
      const mockProducts = [
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Test Product',
          price: 99.99,
          images: ['image1.jpg'],
          variants: []
        }
      ];

      pool.query.mockResolvedValue({ rows: mockProducts });

      // Test without video fields
      const responseWithoutVideos = await request(app)
        .get('/api/products?include_videos=false')
        .expect(200);

      expect(responseWithoutVideos.body[0]).not.toHaveProperty('video_url');
      expect(responseWithoutVideos.body[0]).not.toHaveProperty('video_duration');

      // Verify the SQL query was called without video fields
      expect(pool.query).toHaveBeenCalled();
      const sqlCall = pool.query.mock.calls[0][0];
      expect(sqlCall).not.toContain('video_url');
      expect(sqlCall).not.toContain('video_duration');
    });
  });

  describe('Caching Performance', () => {
    it('should set appropriate caching headers for products with videos', async () => {
      const mockProduct = {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Test Product',
        price: 99.99,
        images: ['image1.jpg'],
        variants: [],
        updated_at: '2024-11-22T10:00:00Z',
        video_url: 'https://example.com/video.mp4',
        video_position: 1,
        video_duration: 120
      };

      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/550e8400-e29b-41d4-a716-446655440003')
        .expect(200);

      expect(response.headers).toHaveProperty('cache-control');
      expect(response.headers['cache-control']).toContain('max-age=3600'); // 1 hour for videos
      expect(response.headers).toHaveProperty('etag');
      expect(response.headers).toHaveProperty('last-modified');
    });

    it('should set longer caching headers for products without videos', async () => {
      const mockProduct = {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Test Product',
        price: 99.99,
        images: ['image1.jpg'],
        variants: [],
        updated_at: '2024-11-22T10:00:00Z'
      };

      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/550e8400-e29b-41d4-a716-446655440009?include_videos=false')
        .expect(200);

      expect(response.headers).toHaveProperty('cache-control');
      expect(response.headers['cache-control']).toContain('max-age=7200'); // 2 hours for non-video products
    });
  });

  describe('Payload Size Impact', () => {
    it('should show minimal payload size increase with video metadata', async () => {
      const baseProduct = {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Test Product',
        price: 99.99,
        images: ['image1.jpg'],
        variants: [],
        updated_at: '2024-11-22T10:00:00Z'
      };

      const productWithVideo = {
        ...baseProduct,
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

      pool.query
        .mockResolvedValueOnce({ rows: [baseProduct] })
        .mockResolvedValueOnce({ rows: [productWithVideo] });

      // Get response without videos
      const responseWithoutVideos = await request(app)
        .get('/api/products/550e8400-e29b-41d4-a716-446655440010?include_videos=false')
        .expect(200);

      // Get response with videos
      const responseWithVideos = await request(app)
        .get('/api/products/550e8400-e29b-41d4-a716-446655440010')
        .expect(200);

      const sizeWithoutVideos = JSON.stringify(responseWithoutVideos.body).length;
      const sizeWithVideos = JSON.stringify(responseWithVideos.body).length;
      const sizeIncrease = sizeWithVideos - sizeWithoutVideos;
      const percentageIncrease = (sizeIncrease / sizeWithoutVideos) * 100;

      expect(sizeWithVideos).toBeGreaterThan(sizeWithoutVideos);
      expect(percentageIncrease).toBeLessThan(50); // Less than 50% size increase
      expect(sizeIncrease).toBeLessThan(500); // Less than 500 characters added
    });
  });

  describe('Concurrent Request Performance', () => {
    it('should handle multiple concurrent requests efficiently', async () => {
      const mockProducts = Array.from({ length: 10 }, (_, i) => ({
        id: `550e8400-e29b-41d4-a716-4466554400${String(i + 1).padStart(2, '0')}`,
        name: `Product ${i + 1}`,
        price: 99.99 + i,
        images: [`image${i}.jpg`],
        variants: [],
        video_url: `https://example.com/video${i}.mp4`,
        video_position: 1,
        video_duration: 120 + i
      }));

      pool.query.mockResolvedValue({ rows: mockProducts });

      const startTime = Date.now();
      
      // Make 10 concurrent requests
      const requests = Array.from({ length: 10 }, (_, i) => 
        request(app)
          .get(`/api/products/550e8400-e29b-41d4-a716-4466554400${String(i + 1).padStart(2, '0')}`)
          .expect(200)
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();

      expect(responses).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(2000); // All requests should complete within 2 seconds
    });
  });

  describe('Performance Recommendations', () => {
    it('should validate performance optimization recommendations', async () => {
      const mockProduct = {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Test Product',
        price: 99.99,
        images: ['image1.jpg'],
        variants: [],
        updated_at: '2024-11-22T10:00:00Z',
        video_url: 'https://example.com/video.mp4',
        video_position: 1,
        video_duration: 120
      };

      pool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/550e8400-e29b-41d4-a716-446655440011')
        .expect(200);

      // Verify caching is implemented
      expect(response.headers).toHaveProperty('cache-control');
      
      // Verify response structure is optimized
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('video_url');
      expect(response.body).toHaveProperty('video_duration');
      
      // Verify no unnecessary fields are included
      expect(response.body).not.toHaveProperty('unnecessary_field');
    });
  });
});