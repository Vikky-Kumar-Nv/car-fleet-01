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
describe('Basic Route Functionality Tests', () => {
    const adminUserId = '507f1f77bcf86cd799439011';
    const dispatcherUserId = '507f1f77bcf86cd799439012';
    const accountantUserId = '507f1f77bcf86cd799439013';
    const customerUserId = '507f1f77bcf86cd799439015';
    describe('Authentication Tests', () => {
        it('should reject requests without authentication token', () => __awaiter(void 0, void 0, void 0, function* () {
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
        it('should reject requests with insufficient permissions', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set((0, auth_helper_1.getAuthHeaders)(customerUserId, 'customer'));
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Forbidden');
        }));
        it('should allow requests with proper authentication and authorization', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.status).toBe(200);
        }));
    });
    describe('Consolidated Vehicles Routes', () => {
        it('should handle GET /api/vehicles with admin auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should handle GET /api/vehicles with dispatcher auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should handle GET /api/vehicles/categories', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles/categories')
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should handle vehicle servicing endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
            const vehicleId = '507f1f77bcf86cd799439020';
            const response = yield (0, supertest_1.default)(app)
                .get(`/api/vehicles/${vehicleId}/servicing`)
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.status).toBe(200);
        }));
    });
    describe('Consolidated Users Routes', () => {
        it('should handle GET /api/customers (public access)', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/customers');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should handle GET /api/drivers with proper auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/drivers')
                .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should reject GET /api/drivers without auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/drivers');
            expect(response.status).toBe(401);
        }));
    });
    describe('Consolidated Financial Routes', () => {
        it('should handle GET /api/payments with accountant auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/payments')
                .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should handle GET /api/metrics with admin auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/metrics')
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.status).toBe(200);
        }));
        it('should maintain legacy /api/finance/metrics endpoint', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/finance/metrics')
                .set((0, auth_helper_1.getAuthHeaders)(accountantUserId, 'accountant'));
            expect(response.status).toBe(200);
        }));
    });
    describe('Consolidated Operations Routes', () => {
        it('should handle GET /api/reports/monthly-earnings', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/reports/monthly-earnings')
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
        it('should handle GET /api/fuel with dispatcher auth', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/fuel')
                .set((0, auth_helper_1.getAuthHeaders)(dispatcherUserId, 'dispatcher'));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
        }));
    });
    describe('Rate Limiting Headers', () => {
        it('should include rate limiting headers on protected routes', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .get('/api/vehicles')
                .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
            expect(response.headers).toHaveProperty('x-ratelimit-limit');
            expect(response.headers).toHaveProperty('x-ratelimit-remaining');
        }));
    });
    describe('Endpoint Existence Tests', () => {
        it('should not return 404 for consolidated route endpoints', () => __awaiter(void 0, void 0, void 0, function* () {
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
                const response = yield (0, supertest_1.default)(app)
                    .get(endpoint)
                    .set((0, auth_helper_1.getAuthHeaders)(adminUserId, 'admin'));
                expect(response.status).not.toBe(404);
            }
        }));
    });
});
