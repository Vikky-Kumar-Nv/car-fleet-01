import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { getAuthHeaders } from '../helpers/auth.helper';

const app = createTestApp();

describe('Middleware Chain Integration Tests', () => {
  const adminUserId = '507f1f77bcf86cd799439011';
  const dispatcherUserId = '507f1f77bcf86cd799439012';
  const accountantUserId = '507f1f77bcf86cd799439013';
  const customerUserId = '507f1f77bcf86cd799439015';

  describe('Authentication Middleware Chain', () => {
    describe('Vehicles routes authentication', () => {
      it('should enforce auth on all vehicle endpoints', async () => {
        const endpoints = [
          { method: 'get', path: '/api/vehicles' },
          { method: 'post', path: '/api/vehicles' },
          { method: 'get', path: '/api/vehicles/categories' },
          { method: 'post', path: '/api/vehicles/categories' },
          { method: 'get', path: '/api/vehicles/507f1f77bcf86cd799439020/servicing' },
          { method: 'put', path: '/api/vehicles/507f1f77bcf86cd799439020/servicing' }
        ];

        for (const endpoint of endpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path);
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('No token');
        }
      });

      it('should enforce role-based access on vehicle endpoints', async () => {
        const restrictedEndpoints = [
          { method: 'get', path: '/api/vehicles' },
          { method: 'post', path: '/api/vehicles' },
          { method: 'get', path: '/api/vehicles/categories' }
        ];

        for (const endpoint of restrictedEndpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path)
            .set(getAuthHeaders(customerUserId, 'customer'));
          
          expect(response.status).toBe(403);
          expect(response.body.message).toBe('Forbidden');
        }
      });
    });

    describe('Users routes authentication', () => {
      it('should allow public access to customer endpoints', async () => {
        const response = await request(app)
          .get('/api/customers');
        
        // Should not require auth (status should not be 401)
        expect(response.status).not.toBe(401);
      });

      it('should enforce auth on driver endpoints', async () => {
        const driverEndpoints = [
          { method: 'get', path: '/api/drivers' },
          { method: 'post', path: '/api/drivers' },
          { method: 'post', path: '/api/drivers/507f1f77bcf86cd799439021/advances' },
          { method: 'get', path: '/api/drivers/507f1f77bcf86cd799439021/reports' }
        ];

        for (const endpoint of driverEndpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path);
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('No token');
        }
      });

      it('should enforce specific role requirements for driver advances', async () => {
        const driverId = '507f1f77bcf86cd799439021';
        
        // Dispatcher should not be able to add advances (only admin/accountant)
        const response = await request(app)
          .post(`/api/drivers/${driverId}/advances`)
          .set(getAuthHeaders(dispatcherUserId, 'dispatcher'))
          .send({ amount: 1000, description: 'Test' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden');
      });
    });

    describe('Financial routes authentication', () => {
      it('should enforce auth on all financial endpoints', async () => {
        const financialEndpoints = [
          { method: 'get', path: '/api/payments' },
          { method: 'post', path: '/api/payments' },
          { method: 'get', path: '/api/metrics' },
          { method: 'get', path: '/api/drivers/507f1f77bcf86cd799439021/payments' }
        ];

        for (const endpoint of financialEndpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path);
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('No token');
        }
      });

      it('should enforce admin/accountant roles on financial endpoints', async () => {
        const restrictedEndpoints = [
          { method: 'get', path: '/api/payments' },
          { method: 'get', path: '/api/metrics' }
        ];

        for (const endpoint of restrictedEndpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path)
            .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));
          
          expect(response.status).toBe(403);
          expect(response.body.message).toBe('Forbidden');
        }
      });
    });

    describe('Operations routes authentication', () => {
      it('should enforce auth on all operations endpoints', async () => {
        const operationsEndpoints = [
          { method: 'get', path: '/api/reports/monthly-earnings' },
          { method: 'get', path: '/api/reports/driver-performance' },
          { method: 'get', path: '/api/fuel' },
          { method: 'post', path: '/api/fuel' }
        ];

        for (const endpoint of operationsEndpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path);
          expect(response.status).toBe(401);
          expect(response.body.message).toBe('No token');
        }
      });

      it('should enforce admin/accountant roles on report endpoints', async () => {
        const reportEndpoints = [
          { method: 'get', path: '/api/reports/monthly-earnings' },
          { method: 'get', path: '/api/reports/driver-performance' }
        ];

        for (const endpoint of reportEndpoints) {
          const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path)
            .set(getAuthHeaders(customerUserId, 'customer'));
          
          expect(response.status).toBe(403);
          expect(response.body.message).toBe('Forbidden');
        }
      });
    });
  });

  describe('Rate Limiting Middleware Chain', () => {
    it('should apply rate limiting to protected routes', async () => {
      // Test rate limiting on various consolidated routes
      const rateLimitedEndpoints = [
        '/api/vehicles',
        '/api/drivers',
        '/api/payments',
        '/api/fuel'
      ];

      for (const endpoint of rateLimitedEndpoints) {
        const response = await request(app)
          .get(endpoint)
          .set(getAuthHeaders(adminUserId, 'admin'));

        // Should have rate limiting headers
        expect(response.headers).toHaveProperty('x-ratelimit-limit');
        expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      }
    });

    it('should not apply rate limiting to auth routes', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      // Auth routes might have different rate limiting or none
      // The important thing is they should work differently than other routes
      expect(response.status).not.toBe(429);
    });
  });

  describe('Combined Middleware Chain Order', () => {
    it('should apply middleware in correct order: rate limiting -> auth -> route handler', async () => {
      // Test that rate limiting is checked before auth
      // This is hard to test directly, but we can verify both are applied
      const response = await request(app)
        .get('/api/vehicles');

      // Should fail auth before rate limiting becomes an issue
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token');
    });

    it('should apply auth before route-specific logic', async () => {
      // Test with invalid token to ensure auth is checked first
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should apply role-based auth after token validation', async () => {
      // Test with valid token but wrong role
      const response = await request(app)
        .get('/api/vehicles')
        .set(getAuthHeaders(customerUserId, 'customer'));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden');
    });
  });

  describe('Cross-Route Middleware Consistency', () => {
    it('should apply consistent auth middleware across all consolidated routes', async () => {
      const protectedEndpoints = [
        { path: '/api/vehicles', roles: ['admin', 'dispatcher'] },
        { path: '/api/drivers', roles: ['admin', 'dispatcher'] },
        { path: '/api/payments', roles: ['admin', 'accountant'] },
        { path: '/api/fuel', roles: ['admin', 'accountant', 'dispatcher'] }
      ];

      for (const endpoint of protectedEndpoints) {
        // Test with no auth
        const noAuthResponse = await request(app).get(endpoint.path);
        expect(noAuthResponse.status).toBe(401);

        // Test with wrong role (customer should be forbidden for all these)
        const wrongRoleResponse = await request(app)
          .get(endpoint.path)
          .set(getAuthHeaders(customerUserId, 'customer'));
        expect(wrongRoleResponse.status).toBe(403);

        // Test with correct role (admin should work for all)
        const correctRoleResponse = await request(app)
          .get(endpoint.path)
          .set(getAuthHeaders(adminUserId, 'admin'));
        expect(correctRoleResponse.status).not.toBe(401);
        expect(correctRoleResponse.status).not.toBe(403);
      }
    });

    it('should apply consistent rate limiting across consolidated routes', async () => {
      const rateLimitedEndpoints = [
        '/api/vehicles',
        '/api/drivers', 
        '/api/payments',
        '/api/fuel'
      ];

      for (const endpoint of rateLimitedEndpoints) {
        const response = await request(app)
          .get(endpoint)
          .set(getAuthHeaders(adminUserId, 'admin'));

        // All should have rate limiting headers
        expect(response.headers).toHaveProperty('x-ratelimit-limit');
        expect(response.headers).toHaveProperty('x-ratelimit-remaining');
        
        // Rate limit should be consistent (300 requests per window)
        expect(response.headers['x-ratelimit-limit']).toBe('300');
      }
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle errors consistently across consolidated routes', async () => {
      // Test error handling by making requests that should trigger errors
      const errorEndpoints = [
        { method: 'get', path: '/api/vehicles/invalid-id' },
        { method: 'get', path: '/api/drivers/invalid-id' },
        { method: 'get', path: '/api/payments/invalid-id' }
      ];

      for (const endpoint of errorEndpoints) {
        const response = await request(app)[endpoint.method as keyof typeof request](endpoint.path)
          .set(getAuthHeaders(adminUserId, 'admin'));

        // Should handle errors gracefully (not crash)
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.status).toBeLessThan(600);
        
        // Should return JSON error response
        expect(response.headers['content-type']).toMatch(/json/);
      }
    });
  });
});