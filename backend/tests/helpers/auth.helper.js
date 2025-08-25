"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultipartAuthHeaders = exports.getAuthHeaders = exports.generateAuthToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../src/config");
const generateAuthToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, config_1.config.jwtSecret, { expiresIn: '1h' });
};
exports.generateAuthToken = generateAuthToken;
const getAuthHeaders = (userId, role) => {
    const token = (0, exports.generateAuthToken)(userId, role);
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};
exports.getAuthHeaders = getAuthHeaders;
const getMultipartAuthHeaders = (userId, role) => {
    const token = (0, exports.generateAuthToken)(userId, role);
    return {
        'Authorization': `Bearer ${token}`
    };
};
exports.getMultipartAuthHeaders = getMultipartAuthHeaders;
