"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
// src/models/vehicle.model.ts
const mongoose_1 = require("mongoose");
const vehicleSchema = new mongoose_1.Schema({
    registrationNumber: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: false }, // optional if categoryId provided
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'VehicleCategory', required: false, index: true },
    owner: { type: String, required: true },
    insuranceExpiry: { type: Date, required: true, index: true },
    fitnessExpiry: { type: Date, required: true, index: true },
    permitExpiry: { type: Date, required: true, index: true },
    pollutionExpiry: { type: Date, required: true, index: true },
    status: { type: String, required: true, index: true },
    photo: { type: String },
    document: { type: String },
    mileageTrips: { type: Number },
    mileageKm: { type: Number },
    createdAt: { type: Date, default: Date.now },
});
exports.Vehicle = (0, mongoose_1.model)('Vehicle', vehicleSchema);
