import request from 'supertest';
import pkg from '@jest/globals';
const { jest } = pkg;

// Mock the database pool
jest.unstable_mockModule('./src/db/pool.js', () => ({
  pool: { 
    query: jest.fn(),
    connect: jest.fn()
  }
}));

const { pool } = await import('./src/db/pool.js');
const { default: app } = await import('./src/app.js');

// Test the payload size logic
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

// Mock the query to return different results
pool.query
  .mockResolvedValueOnce({ rows: [baseProduct] })
  .mockResolvedValueOnce({ rows: [productWithVideo] });

console.log('Testing payload size logic...');

try {
  // Get response without videos
  const responseWithoutVideos = await request(app)
    .get('/api/products/550e8400-e29b-41d4-a716-446655440010?include_videos=false')
    .expect(200);

  console.log('Response without videos:', JSON.stringify(responseWithoutVideos.body, null, 2));
  console.log('Size without videos:', JSON.stringify(responseWithoutVideos.body).length);

  // Get response with videos
  const responseWithVideos = await request(app)
    .get('/api/products/550e8400-e29b-41d4-a716-446655440010')
    .expect(200);

  console.log('Response with videos:', JSON.stringify(responseWithVideos.body, null, 2));
  console.log('Size with videos:', JSON.stringify(responseWithVideos.body).length);

  const sizeWithoutVideos = JSON.stringify(responseWithoutVideos.body).length;
  const sizeWithVideos = JSON.stringify(responseWithVideos.body).length;
  const sizeIncrease = sizeWithVideos - sizeWithoutVideos;
  const percentageIncrease = (sizeIncrease / sizeWithoutVideos) * 100;

  console.log('Size increase:', sizeIncrease);
  console.log('Percentage increase:', percentageIncrease);

} catch (error) {
  console.error('Error:', error.message);
}