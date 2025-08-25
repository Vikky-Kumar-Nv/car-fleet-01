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
// src/index.ts
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./api/middleware");
const routes_1 = require("./api/routes");
const config_1 = require("./config");
const user_seed_1 = require("./seeds/user.seed");
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowed = [config_1.config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
        if (!origin || allowed.includes(origin))
            return callback(null, true);
        console.warn('CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(middleware_1.apiLimiter);
// Health check
app.get('/', (req, res) => res.json({ message: 'Backend API is running on Vercel!' }));
// Serve uploaded files
app.use('/uploads', express_1.default.static(config_1.config.uploadDir));
// MongoDB connection with caching for serverless
let isConnected = false;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected)
        return;
    try {
        yield mongoose_1.default.connect(config_1.config.mongoURI);
        isConnected = true;
        console.log('MongoDB connected');
        yield (0, user_seed_1.seedUsers)();
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
    }
});
// Connect to DB before handling requests
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    next();
}));
// API routes
app.use('/api', routes_1.apiRouter);
// Error handler
app.use(middleware_1.errorHandler);
// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = config_1.config.port || 3000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
// Export for Vercel
exports.default = app;
