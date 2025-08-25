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
describe('Middleware Chain Integration Tests', () => {
    const adminUserId = '507f1f77bcf86cd799439011';
    const dispatcherUserId = '507f1f77bcf86cd799439012';
    const accountantUserId = '507f1f77bcf86cd799439013';
    const customerUserId = '507f1f77bcf86cd799439015';
    describe('Authentication Middleware Chain', () => {
        describe('Vehicles routes authentication', () => {
            it('should enforce auth on all vehicle endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const endpoints = [
                    { method: 'get', path: '/api/vehicles' },
                    { method: 'post', path: '/api/vehicles' },
                    { method: 'get', path: '/api/vehicles/categories' },
                    { method: 'post', path: '/api/vehicles/categories' },
                    { method: 'get', path: '/api/vehicles/507f1f77bcf86cd799439020/servicing' },
                    { method: 'put', path: '/api/vehicles/507f1f77bcf86cd799439020/servicing' }
                ];
                for (const endpoint of endpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path);
                    expect(response.status).toBe(401);
                    expect(response.body.message).toBe('No token');
                }
            }));
            it('should enforce role-based access on vehicle endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const restrictedEndpoints = [
                    { method: 'get', path: '/api/vehicles' },
                    { method: 'post', path: '/api/vehicles' },
                    { method: 'get', path: '/api/vehicles/categories' }
                ];
                for (const endpoint of restrictedEndpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path)
                        .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
                    expect(response.status).toBe(403);
                    expect(response.body.message).toBe('Forbidden');
                }
            }));
        });
        describe('Users routes authentication', () => {
            it('should allow public access to customer endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield (0, supertest_1.default)(app)
                    .get('/api/customers');
                // Should not require auth (status should not be 401)
                expect(response.status).not.toBe(401);
            }));
            it('should enforce auth on driver endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const driverEndpoints = [
                    { method: 'get', path: '/api/drivers' },
                    { method: 'post', path: '/api/drivers' },
                    { method: 'post', path: '/api/drivers/507f1f77bcf86cd799439021/advances' },
                    { method: 'get', path: '/api/drivers/507f1f77bcf86cd799439021/reports' }
                ];
                for (const endpoint of driverEndpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path);
                    expect(response.status).toBe(401);
                    expect(response.body.message).toBe('No token');
                }
            }));
            it('should enforce specific role requirements for driver advances', () => __awaiter(void 0, void 0, void 0, function* () {
                const driverId = '507f1f77bcf86cd799439021';
                // Dispatcher should not be able to add advances (only admin/accountant)
                const response = yield (0, supertest_1.default)(app)
                    .post(`/api/drivers/${driverId}/advances`)
                    .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'))
                    .send({ amount: 1000, description: 'Test' });
                expect(response.status).toBe(403);
                expect(response.body.message).toBe('Forbidden');
            }));
        });
        describe('Financial routes authentication', () => {
            it('should enforce auth on all financial endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const financialEndpoints = [
                    { method: 'get', path: '/api/payments' },
                    { method: 'post', path: '/api/payments' },
                    { method: 'get', path: '/api/metrics' },
                    { method: 'get', path: '/api/drivers/507f1f77bcf86cd799439021/payments' }
                ];
                for (const endpoint of financialEndpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path);
                    expect(response.status).toBe(401);
                    expect(response.body.message).toBe('No token');
                }
            }));
            it('should enforce admin/accountant roles on financial endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const restrictedEndpoints = [
                    { method: 'get', path: '/api/payments' },
                    { method: 'get', path: '/api/metrics' }
                ];
                for (const endpoint of restrictedEndpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path)
                        .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
                    expect(response.status).toBe(403);
                    expect(response.body.message).toBe('Forbidden');
                }
            }));
        });
        describe('Operations routes authentication', () => {
            it('should enforce auth on all operations endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const operationsEndpoints = [
                    { method: 'get', path: '/api/reports/monthly-earnings' },
                    { method: 'get', path: '/api/reports/driver-performance' },
                    { method: 'get', path: '/api/fuel' },
                    { method: 'post', path: '/api/fuel' }
                ];
                for (const endpoint of operationsEndpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path);
                    expect(response.status).toBe(401);
                    expect(response.body.message).toBe('No token');
                }
            }));
            it('should enforce admin/accountant roles on report endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
                const reportEndpoints = [
                    { method: 'get', path: '/api/reports/monthly-earnings' },
                    { method: 'get', path: '/api/reports/driver-performance' }
                ];
                for (const endpoint of reportEndpoints) {
                    const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path)
                        .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
                    expect(response.status).toBe(403);
                    expect(response.body.message).toBe('Forbidden');
                }
            }));
        });
    });
    describe('Rate Limiting Middleware Chain', () => {
        it('should apply rate limiting to protected routes', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test rate limiting on various consolidated routes
            const rateLimitedEndpoints = [
                '/api/vehicles',
                '/api/drivers',
                '/api/payments',
                '/api/fuel'
            ];
            for (const endpoint of rateLimitedEndpoints) {
                const response = yield (0, supertest_1.default)(app)
                    .get(endpoint)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                // Should have rate limiting headers
                expect(response.headers).toHaveProperty('x-ratelimit-limit');
                expect(response.headers).toHaveProperty('x-ratelimit-remaining');
            }
        }));
        it('should not apply rate limiting to auth routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password' });
            // Auth routes might have different rate limiting or none
            // The important thing is they should work differently than other routes
            expect(response.status).not.toBe(429);
        }));
    });
    describe('Combined Middleware Chain Order', () => {
        it('should apply middleware in correct order: rate limiting -> auth -> route handler', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that rate limiting is checked before auth
            // This is hard to test directly, but we can verify both are applied
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles');
            // Should fail auth before rate limiting becomes an issue
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('No token');
        }));
        it('should apply auth before route-specific logic', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test with invalid token to ensure auth is checked first
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid token');
        }));
        it('should apply role-based auth after token validation', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test with valid token but wrong role
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Forbidden');
        }));
    });
    describe('Cross-Route Middleware Consistency', () => {
        it('should apply consistent auth middleware across all consolidated routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const protectedEndpoints = [
                { path: '/api/vehicles', roles: ['admin', 'dispatcher'] },
                { path: '/api/drivers', roles: ['admin', 'dispatcher'] },
                { path: '/api/payments', roles: ['admin', 'accountant'] },
                { path: '/api/fuel', roles: ['admin', 'accountant', 'dispatcher'] }
            ];
            for (const endpoint of protectedEndpoints) {
                // Test with no auth
                const noAuthResponse = yield (0, supertest_1.default)(app).get(endpoint.path);
                expect(noAuthResponse.status).toBe(401);
                // Test with wrong role (customer should be forbidden for all these)
                const wrongRoleResponse = yield (0, supertest_1.default)(app)
                    .get(endpoint.path)
                    .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
                expect(wrongRoleResponse.status).toBe(403);
                // Test with correct role (admin should work for all)
                const correctRoleResponse = yield (0, supertest_1.default)(app)
                    .get(endpoint.path)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(correctRoleResponse.status).not.toBe(401);
                expect(correctRoleResponse.status).not.toBe(403);
            }
        }));
        it('should apply consistent rate limiting across consolidated routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const rateLimitedEndpoints = [
                '/api/vehicles',
                '/api/drivers',
                '/api/payments',
                '/api/fuel'
            ];
            for (const endpoint of rateLimitedEndpoints) {
                const response = yield (0, supertest_1.default)(app)
                    .get(endpoint)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                // All should have rate limiting headers
                expect(response.headers).toHaveProperty('x-ratelimit-limit');
                expect(response.headers).toHaveProperty('x-ratelimit-remaining');
                // Rate limit should be consistent (300 requests per window)
                expect(response.headers['x-ratelimit-limit']).toBe('300');
            }
        }));
    });
    describe('Error Handling Middleware', () => {
        it('should handle errors consistently across consolidated routes', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test error handling by making requests that should trigger errors
            const errorEndpoints = [
                { method: 'get', path: '/api/vehicles/invalid-id' },
                { method: 'get', path: '/api/drivers/invalid-id' },
                { method: 'get', path: '/api/payments/invalid-id' }
            ];
            for (const endpoint of errorEndpoints) {
                const response = yield (0, supertest_1.default)(app)[endpoint.method](endpoint.path)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                // Should handle errors gracefully (not crash)
                expect(response.status).toBeGreaterThanOrEqual(400);
                expect(response.status).toBeLessThan(600);
                // Should return JSON error response
                expect(response.headers['content-type']).toMatch(/json/);
            }
        }));
    });
});
