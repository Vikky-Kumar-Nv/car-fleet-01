"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
// src/models/booking.model.ts
const mongoose_1 = require("mongoose");
const expenseSchema = new mongoose_1.Schema({
    type: { type: String, required: true, enum: ['fuel', 'toll', 'parking', 'other'] },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    receipt: { type: String },
});
const statusChangeSchema = new mongoose_1.Schema({
    status: { type: String, required: true, enum: ['booked', 'ongoing', 'completed'] },
    timestamp: { type: Date, default: Date.now },
    changedBy: { type: String, required: true },
});
const dutySlipSchema = new mongoose_1.Schema({
    path: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    description: { type: String },
});
const bookingSchema = new mongoose_1.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    bookingSource: { type: String, required: true, enum: ['company', 'travel-agency', 'individual'] },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    journeyType: { type: String, required: true, enum: ['outstation', 'local', 'one-way', 'round-trip'] },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    vehicleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Driver' },
    tariffRate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    advanceReceived: { type: Number, required: true },
    balance: { type: Number, required: true },
    status: { type: String, required: true, enum: ['booked', 'ongoing', 'completed'], index: true },
    dutySlips: [dutySlipSchema],
    expenses: [expenseSchema],
    billed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: true },
    statusHistory: [statusChangeSchema],
});
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
