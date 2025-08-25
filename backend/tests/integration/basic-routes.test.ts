import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { getAuthHeaders } from '../helpers/auth.helper';

const app = createTestApp();

describe('Basic Route Functionality Tests', () => {
  const adminUserId = '507f1f77bcf86cd799439011';
  const dispatcherUserId = '507f1f77bcf86cd799439012';
  const accountantUserId = '507f1f77bcf86cd799439013';
  const customerUserId = '507f1f77bcf86cd799439015';

  describe('Authentication Tests', () => {
    it('should reject requests without authentication token', async () => {
      const response = await request(app)
        .get('/api/vehicles');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should reject requests with insufficient permissions', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set(getAuthHeaders(customerUserId, 'customer'));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden');
    });

    it('should allow requests with proper authentication and authorization', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.status).toBe(200);
    });
  });

  describe('Consolidated Vehicles Routes', () => {
    it('should handle GET /api/vehicles with admin auth', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle GET /api/vehicles with dispatcher auth', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle GET /api/vehicles/categories', async () => {
      const response = await request(app)
        .get('/api/vehicles/categories')
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle vehicle servicing endpoints', async () => {
      const vehicleId = '507f1f77bcf86cd799439020';
      
      const response = await request(app)
        .get(`/api/vehicles/${vehicleId}/servicing`)
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.status).toBe(200);
    });
  });

  describe('Consolidated Users Routes', () => {
    it('should handle GET /api/customers (public access)', async () => {
      const response = await request(app)
        .get('/api/customers');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle GET /api/drivers with proper auth', async () => {
      const response = await request(app)
        .get('/api/drivers')
        .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should reject GET /api/drivers without auth', async () => {
      const response = await request(app)
        .get('/api/drivers');

      expect(response.status).toBe(401);
    });
  });

  describe('Consolidated Financial Routes', () => {
    it('should handle GET /api/payments with accountant auth', async () => {
      const response = await request(app)
        .get('/api/payments')
        .set(getAuthHeaders(accountantUserId, 'accountant'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle GET /api/metrics with admin auth', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.status).toBe(200);
    });

    it('should maintain legacy /api/finance/metrics endpoint', async () => {
      const response = await request(app)
        .get('/api/finance/metrics')
        .set(getAuthHeaders(accountantUserId, 'accountant'));

      expect(response.status).toBe(200);
    });
  });

  describe('Consolidated Operations Routes', () => {
    it('should handle GET /api/reports/monthly-earnings', async () => {
      const response = await request(app)
        .get('/api/reports/monthly-earnings')
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle GET /api/fuel with dispatcher auth', async () => {
      const response = await request(app)
        .get('/api/fuel')
        .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('Rate Limiting Headers', () => {
    it('should include rate limiting headers on protected routes', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set(getAuthHeaders(adminUserId, 'admin'));

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
    });
  });

  describe('Endpoint Existence Tests', () => {
    it('should not return 404 for consolidated route endpoints', async () => {
      const endpoints = [
        '/api/vehicles',
        '/api/vehicles/categories', 
        '/api/customers',
        '/api/drivers',
        '/api/payments',
        '/api/metrics',
        '/api/reports/monthly-earnings',
        '/api/fuel'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).not.toBe(404);
      }
    });
  });
});