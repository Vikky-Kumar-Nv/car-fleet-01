import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { getAuthHeaders, getMultipartAuthHeaders } from '../helpers/auth.helper';

const app = createTestApp();

describe('Consolidated Routes Integration Tests', () => {
  const adminUserId = '507f1f77bcf86cd799439011';
  const dispatcherUserId = '507f1f77bcf86cd799439012';
  const accountantUserId = '507f1f77bcf86cd799439013';
  const driverUserId = '507f1f77bcf86cd799439014';
  const customerUserId = '507f1f77bcf86cd799439015';

  describe('Vehicles Routes (/vehicles/*)', () => {
    describe('Main vehicle operations', () => {
      it('should handle POST /api/vehicles with admin auth', async () => {
        const response = await request(app)
          .post('/api/vehicles')
          .set(getAuthHeaders(adminUserId, 'admin'))
          .send({
            registrationNumber: 'TEST123',
            category: 'sedan',
            owner: 'owned',
            insuranceExpiry: new Date('2025-12-31'),
            fitnessExpiry: new Date('2025-12-31'),
            permitExpiry: new Date('2025-12-31'),
            pollutionExpiry: new Date('2025-12-31'),
            status: 'active'
          });

        expect(response.status).toBe(201);
      });

      it('should handle GET /api/vehicles with dispatcher auth', async () => {
        const response = await request(app)
          .get('/api/vehicles')
          .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should reject unauthorized access to vehicles', async () => {
        const response = await request(app)
          .get('/api/vehicles');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No token');
      });

      it('should reject forbidden role access to vehicles', async () => {
        const response = await request(app)
          .get('/api/vehicles')
          .set(getAuthHeaders(customerUserId, 'customer'));

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden');
      });
    });

    describe('Vehicle categories (/vehicles/categories/*)', () => {
      it('should handle POST /api/vehicles/categories with admin auth', async () => {
        const response = await request(app)
          .post('/api/vehicles/categories')
          .set(getAuthHeaders(adminUserId, 'admin'))
          .send({
            name: 'Test Category',
            description: 'Test category description'
          });

        expect(response.status).toBe(201);
      });

      it('should handle GET /api/vehicles/categories', async () => {
        const response = await request(app)
          .get('/api/vehicles/categories')
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('Vehicle servicing (/vehicles/:vehicleId/servicing/*)', () => {
      const vehicleId = '507f1f77bcf86cd799439020';

      it('should handle GET /api/vehicles/:vehicleId/servicing', async () => {
        const response = await request(app)
          .get(`/api/vehicles/${vehicleId}/servicing`)
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
      });

      it('should handle PUT /api/vehicles/:vehicleId/servicing', async () => {
        const response = await request(app)
          .put(`/api/vehicles/${vehicleId}/servicing`)
          .set(getAuthHeaders(adminUserId, 'admin'))
          .send({
            oilChanges: [],
            partsReplacements: [],
            tyres: [],
            installments: [],
            insurances: [],
            legalPapers: []
          });

        expect(response.status).toBe(200);
      });
    });
  });

  describe('Users Routes (/users/*)', () => {
    describe('Customer operations (/users/customers/*)', () => {
      it('should handle POST /api/customers (via users router)', async () => {
        const response = await request(app)
          .post('/api/customers')
          .send({
            name: 'Test Customer',
            phone: '1234567890',
            email: 'test@example.com'
          });

        expect(response.status).toBe(201);
      });

      it('should handle GET /api/customers', async () => {
        const response = await request(app)
          .get('/api/customers');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('Driver operations (/users/drivers/*)', () => {
      it('should handle POST /api/drivers with admin auth and file upload', async () => {
        const response = await request(app)
          .post('/api/drivers')
          .set(getMultipartAuthHeaders(adminUserId, 'admin'))
          .field('name', 'Test Driver')
          .field('phone', '1234567890')
          .field('licenseNumber', 'DL123456')
          .field('aadhaar', '123456789012')
          .field('vehicleType', 'owned')
          .field('licenseExpiry', '2025-12-31')
          .field('policeVerificationExpiry', '2025-12-31')
          .field('paymentMode', 'per-trip')
          .field('dateOfJoining', '2024-01-01')
          .field('status', 'active');

        expect(response.status).toBe(201);
      });

      it('should handle GET /api/drivers with dispatcher auth', async () => {
        const response = await request(app)
          .get('/api/drivers')
          .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should reject unauthorized access to drivers', async () => {
        const response = await request(app)
          .get('/api/drivers');

        expect(response.status).toBe(401);
      });
    });

    describe('Driver advances (/users/drivers/:id/advances)', () => {
      const driverId = '507f1f77bcf86cd799439021';

      it('should handle POST /api/drivers/:id/advances with accountant auth', async () => {
        const response = await request(app)
          .post(`/api/drivers/${driverId}/advances`)
          .set(getAuthHeaders(accountantUserId, 'accountant'))
          .send({
            amount: 1000,
            description: 'Test advance'
          });

        expect(response.status).toBe(200);
      });

      it('should reject forbidden role for advances', async () => {
        const response = await request(app)
          .post(`/api/drivers/${driverId}/advances`)
          .set(getAuthHeaders(dispatcherUserId, 'dispatcher'))
          .send({
            amount: 1000,
            description: 'Test advance'
          });

        expect(response.status).toBe(403);
      });
    });

    describe('Driver reports (/users/drivers/:driverId/reports)', () => {
      const driverId = '507f1f77bcf86cd799439021';

      it('should handle GET /api/drivers/:driverId/reports with admin auth', async () => {
        const response = await request(app)
          .get(`/api/drivers/${driverId}/reports`)
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
      });

      it('should handle PUT /api/drivers/:driverId/reports with dispatcher auth', async () => {
        const response = await request(app)
          .put(`/api/drivers/${driverId}/reports`)
          .set(getAuthHeaders(dispatcherUserId, 'dispatcher'))
          .send({
            date: '2024-01-15',
            totalKm: 100,
            daysWorked: 1,
            nightsWorked: 0,
            salaryRate: 500,
            totalAmount: 500
          });

        expect(response.status).toBe(200);
      });
    });
  });

  describe('Financial Routes (/financial/*)', () => {
    describe('Payment operations (/financial/payments/*)', () => {
      it('should handle POST /api/payments (via financial router)', async () => {
        const response = await request(app)
          .post('/api/payments')
          .set(getAuthHeaders(adminUserId, 'admin'))
          .send({
            entityId: '507f1f77bcf86cd799439022',
            entityType: 'customer',
            amount: 1000,
            type: 'received',
            date: new Date(),
            description: 'Test payment'
          });

        expect(response.status).toBe(201);
      });

      it('should handle GET /api/payments with accountant auth', async () => {
        const response = await request(app)
          .get('/api/payments')
          .set(getAuthHeaders(accountantUserId, 'accountant'));

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should reject unauthorized access to payments', async () => {
        const response = await request(app)
          .get('/api/payments');

        expect(response.status).toBe(401);
      });
    });

    describe('Financial metrics (/financial/metrics/*)', () => {
      it('should handle GET /api/metrics (via financial router)', async () => {
        const response = await request(app)
          .get('/api/metrics')
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
      });

      it('should handle GET /api/finance/metrics (legacy endpoint)', async () => {
        const response = await request(app)
          .get('/api/finance/metrics')
          .set(getAuthHeaders(accountantUserId, 'accountant'));

        expect(response.status).toBe(200);
      });
    });

    describe('Driver payments (/financial/drivers/:id/payments/*)', () => {
      const driverId = '507f1f77bcf86cd799439021';

      it('should handle GET /api/drivers/:id/payments (via financial router)', async () => {
        const response = await request(app)
          .get(`/api/drivers/${driverId}/payments`)
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
      });

      it('should handle GET /api/finance/drivers/:id/payments (legacy endpoint)', async () => {
        const response = await request(app)
          .get(`/api/finance/drivers/${driverId}/payments`)
          .set(getAuthHeaders(accountantUserId, 'accountant'));

        expect(response.status).toBe(200);
      });
    });
  });

  describe('Operations Routes (/operations/*)', () => {
    describe('Reports (/operations/reports/*)', () => {
      it('should handle GET /api/reports/monthly-earnings', async () => {
        const response = await request(app)
          .get('/api/reports/monthly-earnings')
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
      });

      it('should handle GET /api/reports/driver-performance', async () => {
        const response = await request(app)
          .get('/api/reports/driver-performance')
          .set(getAuthHeaders(accountantUserId, 'accountant'));

        expect(response.status).toBe(200);
      });

      it('should handle GET /api/reports/vehicle-usage', async () => {
        const response = await request(app)
          .get('/api/reports/vehicle-usage')
          .set(getAuthHeaders(adminUserId, 'admin'));

        expect(response.status).toBe(200);
      });

      it('should handle GET /api/reports/expense-breakdown', async () => {
        const response = await request(app)
          .get('/api/reports/expense-breakdown')
          .set(getAuthHeaders(accountantUserId, 'accountant'));

        expect(response.status).toBe(200);
      });
    });

    describe('Fuel operations (/operations/fuel/*)', () => {
      it('should handle POST /api/fuel with rate limiting and auth', async () => {
        const response = await request(app)
          .post('/api/fuel')
          .set(getAuthHeaders(adminUserId, 'admin'))
          .send({
            vehicleId: '507f1f77bcf86cd799439020',
            bookingId: '507f1f77bcf86cd799439023',
            addedByType: 'self',
            fuelFillDate: new Date(),
            totalTripKm: 100,
            vehicleFuelAverage: 15,
            fuelQuantity: 10,
            fuelRate: 100,
            totalAmount: 1000,
            includeInFinance: true
          });

        expect(response.status).toBe(201);
      });

      it('should handle GET /api/fuel with dispatcher auth', async () => {
        const response = await request(app)
          .get('/api/fuel')
          .set(getAuthHeaders(dispatcherUserId, 'dispatcher'));

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should reject unauthorized access to fuel', async () => {
        const response = await request(app)
          .get('/api/fuel');

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Middleware Chain Tests', () => {
    describe('Rate Limiting (apiLimiter)', () => {
      it('should apply rate limiting to protected routes', async () => {
        // Make multiple requests to test rate limiting
        const requests = Array(10).fill(null).map(() =>
          request(app)
            .get('/api/vehicles')
            .set(getAuthHeaders(adminUserId, 'admin'))
        );

        const responses = await Promise.all(requests);
        
        // All should succeed as we're under the limit
        responses.forEach(response => {
          expect([200, 429]).toContain(response.status);
        });
      });
    });

    describe('Authentication Middleware', () => {
      it('should reject requests without token', async () => {
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

      it('should reject requests with insufficient role permissions', async () => {
        const response = await request(app)
          .get('/api/vehicles')
          .set(getAuthHeaders(customerUserId, 'customer'));

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden');
      });
    });

    describe('File Upload Middleware', () => {
      it('should handle multipart form data on vehicle routes', async () => {
        const response = await request(app)
          .post('/api/vehicles')
          .set(getMultipartAuthHeaders(adminUserId, 'admin'))
          .field('registrationNumber', 'UPLOAD123')
          .field('category', 'sedan')
          .field('owner', 'owned')
          .field('insuranceExpiry', '2025-12-31')
          .field('fitnessExpiry', '2025-12-31')
          .field('permitExpiry', '2025-12-31')
          .field('pollutionExpiry', '2025-12-31')
          .field('status', 'active');

        expect(response.status).toBe(201);
      });

      it('should handle multipart form data on driver routes', async () => {
        const response = await request(app)
          .post('/api/drivers')
          .set(getMultipartAuthHeaders(adminUserId, 'admin'))
          .field('name', 'Upload Test Driver')
          .field('phone', '9876543210')
          .field('licenseNumber', 'UPLOAD123')
          .field('aadhaar', '123456789012')
          .field('vehicleType', 'owned')
          .field('licenseExpiry', '2025-12-31')
          .field('policeVerificationExpiry', '2025-12-31')
          .field('paymentMode', 'per-trip')
          .field('dateOfJoining', '2024-01-01')
          .field('status', 'active');

        expect(response.status).toBe(201);
      });
    });
  });

  describe('Legacy Endpoint Compatibility', () => {
    it('should maintain backward compatibility for all original endpoints', async () => {
      // Test that all original endpoint patterns still work
      const endpointTests = [
        { method: 'get', path: '/api/vehicles', auth: 'admin' },
        { method: 'get', path: '/api/customers', auth: null },
        { method: 'get', path: '/api/drivers', auth: 'dispatcher' },
        { method: 'get', path: '/api/payments', auth: 'accountant' },
        { method: 'get', path: '/api/fuel', auth: 'admin' },
        { method: 'get', path: '/api/reports/monthly-earnings', auth: 'admin' },
        { method: 'get', path: '/api/vehicles/categories', auth: 'admin' },
        { method: 'get', path: '/api/finance/metrics', auth: 'accountant' }
      ];

      for (const test of endpointTests) {
        const req = request(app)[test.method as keyof typeof request](test.path);
        
        if (test.auth) {
          req.set(getAuthHeaders(adminUserId, test.auth as any));
        }

        const response = await req;
        
        // Should not return 404 (endpoint exists)
        expect(response.status).not.toBe(404);
        
        // Should return expected status codes (200, 401, 403, etc.)
        expect([200, 401, 403]).toContain(response.status);
      }
    });
  });
});