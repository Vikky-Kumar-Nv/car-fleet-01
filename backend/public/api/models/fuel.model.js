"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelEntry = void 0;
// src/api/models/fuel.model.ts
const mongoose_1 = require("mongoose");
const fuelSchema = new mongoose_1.Schema({
    vehicleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    addedByType: { type: String, enum: ['self', 'driver'], required: true },
    fuelFillDate: { type: Date, required: true, index: true },
    totalTripKm: { type: Number, required: true },
    vehicleFuelAverage: { type: Number, required: true },
    fuelQuantity: { type: Number, required: true },
    fuelRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    comment: { type: String },
    includeInFinance: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
fuelSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.FuelEntry = (0, mongoose_1.model)('FuelEntry', fuelSchema);
