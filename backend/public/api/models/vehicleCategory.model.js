"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleCategory = void 0;
// src/models/vehicleCategory.model.ts
const mongoose_1 = require("mongoose");
const vehicleCategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});
exports.VehicleCategory = (0, mongoose_1.model)('VehicleCategory', vehicleCategorySchema);
