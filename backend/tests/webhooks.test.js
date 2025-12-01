import request from 'supertest';
import app from '../src/app.js';
describe('stripe webhook', () => {
  it('rejects invalid signature', async () => {
    const res = await request(app)
      .post('/api/webhooks/stripe')
      .set('stripe-signature', 'invalid')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
