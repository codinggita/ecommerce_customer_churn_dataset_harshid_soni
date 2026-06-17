const request = require('supertest');
const app = require('../src/app');

describe('Customer API Tests', () => {
  it('should return a healthy status on the health check endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API health check passed.');
  });
});
