"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: Number(process.env.PORT) || 3000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/bolt',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
};
