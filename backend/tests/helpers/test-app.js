"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = require("../../src/api/routes");
const createTestApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Routes
    app.use('/api', routes_1.apiRouter);
    // Global error handler
    app.use((err, req, res, next) => {
        console.error('Test error:', err);
        const status = err.status || 500;
        res.status(status).json({
            message: err.message || 'Internal server error',
            error: process.env.NODE_ENV === 'test' ? err.stack : undefined
        });
    });
    return app;
};
exports.createTestApp = createTestApp;
