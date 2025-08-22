"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.City = void 0;
const mongoose_1 = require("mongoose");
const citySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    createdAt: { type: Date, default: Date.now },
});
exports.City = (0, mongoose_1.model)('City', citySchema);
