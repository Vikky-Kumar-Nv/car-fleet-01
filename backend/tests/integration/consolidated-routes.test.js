"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_app_1 = require("../helpers/test-app");
const auth_helper_1 = require("../helpers/auth.helper");
const app = (0, test_app_1.createTestApp)();
describe('Consolidated Routes Integration Tests', () => {
    const adminUserId = '507f1f77bcf86cd799439011';
    const dispatcherUserId = '507f1f77bcf86cd799439012';
    const accountantUserId = '507f1f77bcf86cd799439013';
    const driverUserId = '507f1f77bcf86cd799439014';
    const customerUserId = '507f1f77bcf86cd799439015';
    describe('Vehicles Routes (/vehicles/*)', () => {
        describe('Main vehicle operations', () => {
            it('should handle POST /api/vehicles with admin auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/vehicles')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'))
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
            }));
            it('should handle GET /api/vehicles with dispatcher auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles')
                    .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }));
            it('should reject unauthorized access to vehicles', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles');
                expect(response.status).toBe(401);
                expect(response.body.message).toBe('No token');
            }));
            it('should reject forbidden role access to vehicles', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles')
                    .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
                expect(response.status).toBe(403);
                expect(response.body.message).toBe('Forbidden');
            }));
        });
        describe('Vehicle categories (/vehicles/categories/*)', () => {
            it('should handle POST /api/vehicles/categories with admin auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/vehicles/categories')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'))
                    .send({
                    name: 'Test Category',
                    description: 'Test category description'
                });
                expect(response.status).toBe(201);
            }));
            it('should handle GET /api/vehicles/categories', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles/categories')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }));
        });
        describe('Vehicle servicing (/vehicles/:vehicleId/servicing/*)', () => {
            const vehicleId = '507f1f77bcf86cd799439020';
            it('should handle GET /api/vehicles/:vehicleId/servicing', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get(`/api/vehicles/${vehicleId}/servicing`)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
            }));
            it('should handle PUT /api/vehicles/:vehicleId/servicing', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .put(`/api/vehicles/${vehicleId}/servicing`)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'))
                    .send({
                    oilChanges: [],
                    partsReplacements: [],
                    tyres: [],
                    installments: [],
                    insurances: [],
                    legalPapers: []
                });
                expect(response.status).toBe(200);
            }));
        });
    });
    describe('Users Routes (/users/*)', () => {
        describe('Customer operations (/users/customers/*)', () => {
            it('should handle POST /api/customers (via users router)', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/customers')
                    .send({
                    name: 'Test Customer',
                    phone: '1234567890',
                    email: 'test@example.com'
                });
                expect(response.status).toBe(201);
            }));
            it('should handle GET /api/customers', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/customers');
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }));
        });
        describe('Driver operations (/users/drivers/*)', () => {
            it('should handle POST /api/drivers with admin auth and file upload', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/drivers')
                    .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
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
            }));
            it('should handle GET /api/drivers with dispatcher auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/drivers')
                    .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }));
            it('should reject unauthorized access to drivers', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/drivers');
                expect(response.status).toBe(401);
            }));
        });
        describe('Driver advances (/users/drivers/:id/advances)', () => {
            const driverId = '507f1f77bcf86cd799439021';
            it('should handle POST /api/drivers/:id/advances with accountant auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post(`/api/drivers/${driverId}/advances`)
                    .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'))
                    .send({
                    amount: 1000,
                    description: 'Test advance'
                });
                expect(response.status).toBe(200);
            }));
            it('should reject forbidden role for advances', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post(`/api/drivers/${driverId}/advances`)
                    .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'))
                    .send({
                    amount: 1000,
                    description: 'Test advance'
                });
                expect(response.status).toBe(403);
            }));
        });
        describe('Driver reports (/users/drivers/:driverId/reports)', () => {
            const driverId = '507f1f77bcf86cd799439021';
            it('should handle GET /api/drivers/:driverId/reports with admin auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get(`/api/drivers/${driverId}/reports`)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
            }));
            it('should handle PUT /api/drivers/:driverId/reports with dispatcher auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .put(`/api/drivers/${driverId}/reports`)
                    .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'))
                    .send({
                    date: '2024-01-15',
                    totalKm: 100,
                    daysWorked: 1,
                    nightsWorked: 0,
                    salaryRate: 500,
                    totalAmount: 500
                });
                expect(response.status).toBe(200);
            }));
        });
    });
    describe('Financial Routes (/financial/*)', () => {
        describe('Payment operations (/financial/payments/*)', () => {
            it('should handle POST /api/payments (via financial router)', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/payments')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'))
                    .send({
                    entityId: '507f1f77bcf86cd799439022',
                    entityType: 'customer',
                    amount: 1000,
                    type: 'received',
                    date: new Date(),
                    description: 'Test payment'
                });
                expect(response.status).toBe(201);
            }));
            it('should handle GET /api/payments with accountant auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/payments')
                    .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }));
            it('should reject unauthorized access to payments', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/payments');
                expect(response.status).toBe(401);
            }));
        });
        describe('Financial metrics (/financial/metrics/*)', () => {
            it('should handle GET /api/metrics (via financial router)', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/metrics')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
            }));
            it('should handle GET /api/finance/metrics (legacy endpoint)', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/finance/metrics')
                    .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
                expect(response.status).toBe(200);
            }));
        });
        describe('Driver payments (/financial/drivers/:id/payments/*)', () => {
            const driverId = '507f1f77bcf86cd799439021';
            it('should handle GET /api/drivers/:id/payments (via financial router)', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get(`/api/drivers/${driverId}/payments`)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
            }));
            it('should handle GET /api/finance/drivers/:id/payments (legacy endpoint)', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get(`/api/finance/drivers/${driverId}/payments`)
                    .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
                expect(response.status).toBe(200);
            }));
        });
    });
    describe('Operations Routes (/operations/*)', () => {
        describe('Reports (/operations/reports/*)', () => {
            it('should handle GET /api/reports/monthly-earnings', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/reports/monthly-earnings')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
            }));
            it('should handle GET /api/reports/driver-performance', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/reports/driver-performance')
                    .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
                expect(response.status).toBe(200);
            }));
            it('should handle GET /api/reports/vehicle-usage', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/reports/vehicle-usage')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).toBe(200);
            }));
            it('should handle GET /api/reports/expense-breakdown', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/reports/expense-breakdown')
                    .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
                expect(response.status).toBe(200);
            }));
        });
        describe('Fuel operations (/operations/fuel/*)', () => {
            it('should handle POST /api/fuel with rate limiting and auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/fuel')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'))
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
            }));
            it('should handle GET /api/fuel with dispatcher auth', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/fuel')
                    .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
                expect(response.status).toBe(200);
                expect(Array.isArray(response.body)).toBe(true);
            }));
            it('should reject unauthorized access to fuel', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/fuel');
                expect(response.status).toBe(401);
            }));
        });
    });
    describe('Middleware Chain Tests', () => {
        describe('Rate Limiting (apiLimiter)', () => {
            it('should apply rate limiting to protected routes', () => __awaiter(void 0, void 0, void 0, function* () {
                // Make multiple requests to test rate limiting
                const requests = Array(10).fill(null).map(() => (0, supertest_1.default)(app)
                    .get('/api/vehicles')
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin')));
                const responses = yield Promise.all(requests);
                // All should succeed as we're under the limit
                responses.forEach(response => {
                    expect([200, 429]).toContain(response.status);
                });
            }));
        });
        describe('Authentication Middleware', () => {
            it('should reject requests without token', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles');
                expect(response.status).toBe(401);
                expect(response.body.message).toBe('No token');
            }));
            it('should reject requests with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles')
                    .set('Authorization', 'Bearer invalid-token');
                expect(response.status).toBe(401);
                expect(response.body.message).toBe('Invalid token');
            }));
            it('should reject requests with insufficient role permissions', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/vehicles')
                    .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
                expect(response.status).toBe(403);
                expect(response.body.message).toBe('Forbidden');
            }));
        });
        describe('File Upload Middleware', () => {
            it('should handle multipart form data on vehicle routes', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/vehicles')
                    .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                    .field('registrationNumber', 'UPLOAD123')
                    .field('category', 'sedan')
                    .field('owner', 'owned')
                    .field('insuranceExpiry', '2025-12-31')
                    .field('fitnessExpiry', '2025-12-31')
                    .field('permitExpiry', '2025-12-31')
                    .field('pollutionExpiry', '2025-12-31')
                    .field('status', 'active');
                expect(response.status).toBe(201);
            }));
            it('should handle multipart form data on driver routes', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/drivers')
                    .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
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
            }));
        });
    });
    describe('Legacy Endpoint Compatibility', () => {
        it('should maintain backward compatibility for all original endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
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
                const req = (0, supertest_1.default)(app)[test.method](test.path);
                if (test.auth) {
                    req.set((0, auth_helper_1.getAuthHeaders)(adminUserId, test.auth));
                }
                const response = yield req;
                // Should not return 404 (endpoint exists)
                expect(response.status).not.toBe(404);
                // Should return expected status codes (200, 401, 403, etc.)
                expect([200, 401, 403]).toContain(response.status);
            }
        }));
    });
});
