"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
// src/models/payment.model.ts
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    entityId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    entityType: { type: String, required: true, enum: ['customer', 'driver'] },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['received', 'paid'] },
    date: { type: Date, default: Date.now, index: true },
    description: { type: String },
    relatedAdvanceId: { type: String },
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking' },
    driverPaymentMode: { type: String, enum: ['per-trip', 'daily', 'fuel-basis'] },
    fuelQuantity: { type: Number },
    fuelRate: { type: Number },
    computedAmount: { type: Number },
    // For fuel-basis payments: allow deriving fuelQuantity from distance and mileage
    distanceKm: { type: Number },
    mileage: { type: Number },
    settled: { type: Boolean, default: false },
    settledAt: { type: Date },
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
