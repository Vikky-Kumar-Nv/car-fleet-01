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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, test_app_1.createTestApp)();
describe('File Upload Integration Tests', () => {
    const adminUserId = '507f1f77bcf86cd799439011';
    const dispatcherUserId = '507f1f77bcf86cd799439012';
    // Create a test image file for upload tests
    const testImagePath = path_1.default.join(__dirname, '../fixtures/test-image.png');
    beforeAll(() => {
        // Create test fixtures directory if it doesn't exist
        const fixturesDir = path_1.default.dirname(testImagePath);
        if (!fs_1.default.existsSync(fixturesDir)) {
            fs_1.default.mkdirSync(fixturesDir, { recursive: true });
        }
        // Create a minimal PNG file for testing
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
            0x49, 0x48, 0x44, 0x52, // IHDR
            0x00, 0x00, 0x00, 0x01, // width: 1
            0x00, 0x00, 0x00, 0x01, // height: 1
            0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
            0x90, 0x77, 0x53, 0xDE, // CRC
            0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
            0x49, 0x44, 0x41, 0x54, // IDAT
            0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, // data
            0x02, 0x00, 0x01, // CRC
            0x00, 0x00, 0x00, 0x00, // IEND chunk length
            0x49, 0x45, 0x4E, 0x44, // IEND
            0xAE, 0x42, 0x60, 0x82 // CRC
        ]);
        fs_1.default.writeFileSync(testImagePath, pngBuffer);
    });
    afterAll(() => {
        // Clean up test file
        if (fs_1.default.existsSync(testImagePath)) {
            fs_1.default.unlinkSync(testImagePath);
        }
    });
    describe('Vehicle File Upload', () => {
        it('should handle vehicle creation with photo upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/vehicles')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('registrationNumber', 'PHOTO123')
                .field('category', 'sedan')
                .field('owner', 'owned')
                .field('insuranceExpiry', '2025-12-31')
                .field('fitnessExpiry', '2025-12-31')
                .field('permitExpiry', '2025-12-31')
                .field('pollutionExpiry', '2025-12-31')
                .field('status', 'active')
                .attach('photo', testImagePath);
            expect(response.status).toBe(201);
        }));
        it('should handle vehicle creation with document upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/vehicles')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('registrationNumber', 'DOC123')
                .field('category', 'sedan')
                .field('owner', 'owned')
                .field('insuranceExpiry', '2025-12-31')
                .field('fitnessExpiry', '2025-12-31')
                .field('permitExpiry', '2025-12-31')
                .field('pollutionExpiry', '2025-12-31')
                .field('status', 'active')
                .attach('document', testImagePath);
            expect(response.status).toBe(201);
        }));
        it('should handle vehicle update with file upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const vehicleId = '507f1f77bcf86cd799439020';
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/vehicles/${vehicleId}`)
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('registrationNumber', 'UPDATE123')
                .field('category', 'sedan')
                .field('owner', 'owned')
                .field('insuranceExpiry', '2025-12-31')
                .field('fitnessExpiry', '2025-12-31')
                .field('permitExpiry', '2025-12-31')
                .field('pollutionExpiry', '2025-12-31')
                .field('status', 'active')
                .attach('photo', testImagePath);
            expect(response.status).toBe(200);
        }));
    });
    describe('Driver File Upload', () => {
        it('should handle driver creation with photo upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/drivers')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('name', 'Photo Driver')
                .field('phone', '1111111111')
                .field('licenseNumber', 'PHOTO123')
                .field('aadhaar', '123456789012')
                .field('vehicleType', 'owned')
                .field('licenseExpiry', '2025-12-31')
                .field('policeVerificationExpiry', '2025-12-31')
                .field('paymentMode', 'per-trip')
                .field('dateOfJoining', '2024-01-01')
                .field('status', 'active')
                .attach('photo', testImagePath);
            expect(response.status).toBe(201);
        }));
        it('should handle driver creation with license document upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/drivers')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('name', 'License Driver')
                .field('phone', '2222222222')
                .field('licenseNumber', 'LICENSE123')
                .field('aadhaar', '123456789012')
                .field('vehicleType', 'owned')
                .field('licenseExpiry', '2025-12-31')
                .field('policeVerificationExpiry', '2025-12-31')
                .field('paymentMode', 'per-trip')
                .field('dateOfJoining', '2024-01-01')
                .field('status', 'active')
                .attach('licenseDocument', testImagePath);
            expect(response.status).toBe(201);
        }));
        it('should handle driver creation with police verification document upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/drivers')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('name', 'Police Driver')
                .field('phone', '3333333333')
                .field('licenseNumber', 'POLICE123')
                .field('aadhaar', '123456789012')
                .field('vehicleType', 'owned')
                .field('licenseExpiry', '2025-12-31')
                .field('policeVerificationExpiry', '2025-12-31')
                .field('paymentMode', 'per-trip')
                .field('dateOfJoining', '2024-01-01')
                .field('status', 'active')
                .attach('policeVerificationDocument', testImagePath);
            expect(response.status).toBe(201);
        }));
        it('should handle driver creation with multiple file uploads', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/drivers')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('name', 'Multi File Driver')
                .field('phone', '4444444444')
                .field('licenseNumber', 'MULTI123')
                .field('aadhaar', '123456789012')
                .field('vehicleType', 'owned')
                .field('licenseExpiry', '2025-12-31')
                .field('policeVerificationExpiry', '2025-12-31')
                .field('paymentMode', 'per-trip')
                .field('dateOfJoining', '2024-01-01')
                .field('status', 'active')
                .attach('photo', testImagePath)
                .attach('licenseDocument', testImagePath)
                .attach('policeVerificationDocument', testImagePath)
                .attach('document', testImagePath);
            expect(response.status).toBe(201);
        }));
        it('should handle driver update with file upload', () => __awaiter(void 0, void 0, void 0, function* () {
            const driverId = '507f1f77bcf86cd799439021';
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/drivers/${driverId}`)
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('name', 'Updated Driver')
                .field('phone', '5555555555')
                .field('licenseNumber', 'UPDATE123')
                .field('aadhaar', '123456789012')
                .field('vehicleType', 'owned')
                .field('licenseExpiry', '2025-12-31')
                .field('policeVerificationExpiry', '2025-12-31')
                .field('paymentMode', 'per-trip')
                .field('dateOfJoining', '2024-01-01')
                .field('status', 'active')
                .attach('photo', testImagePath);
            expect(response.status).toBe(200);
        }));
    });
    describe('File Upload Error Handling', () => {
        it('should handle requests without files gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/vehicles')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                .field('registrationNumber', 'NOFILE123')
                .field('category', 'sedan')
                .field('owner', 'owned')
                .field('insuranceExpiry', '2025-12-31')
                .field('fitnessExpiry', '2025-12-31')
                .field('permitExpiry', '2025-12-31')
                .field('pollutionExpiry', '2025-12-31')
                .field('status', 'active');
            expect(response.status).toBe(201);
        }));
        it('should maintain authentication on multipart requests', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/drivers')
                .field('name', 'Unauth Driver')
                .field('phone', '6666666666')
                .attach('photo', testImagePath);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('No token');
        }));
        it('should maintain authorization on multipart requests', () => __awaiter(void 0, void 0, void 0, function* () {
            const customerUserId = '507f1f77bcf86cd799439015';
            const response = yield (0, supertest_1.default)(app)
                .post('/api/drivers')
                .set((0, auth_helper_1.getMultipartAuthHeaders)(customerUserId, 'customer'))
                .field('name', 'Forbidden Driver')
                .field('phone', '7777777777')
                .attach('photo', testImagePath);
            expect(response.status).toBe(403);
            expect(response.body.message).toBe('Forbidden');
        }));
    });
    describe('Upload Middleware Configuration', () => {
        it('should accept all configured field names', () => __awaiter(void 0, void 0, void 0, function* () {
            // Test that the upload middleware accepts all the configured field names
            const fieldNames = ['photo', 'licenseDocument', 'policeVerificationDocument', 'document'];
            for (const fieldName of fieldNames) {
                const response = yield (0, supertest_1.default)(app)
                    .post('/api/drivers')
                    .set((0, auth_helper_1.getMultipartAuthHeaders)(adminUserId, 'admin'))
                    .field('name', `${fieldName} Driver`)
                    .field('phone', '8888888888')
                    .field('licenseNumber', `${fieldName.toUpperCase()}123`)
                    .field('aadhaar', '123456789012')
                    .field('vehicleType', 'owned')
                    .field('licenseExpiry', '2025-12-31')
                    .field('policeVerificationExpiry', '2025-12-31')
                    .field('paymentMode', 'per-trip')
                    .field('dateOfJoining', '2024-01-01')
                    .field('status', 'active')
                    .attach(fieldName, testImagePath);
                expect(response.status).toBe(201);
            }
        }));
    });
});
