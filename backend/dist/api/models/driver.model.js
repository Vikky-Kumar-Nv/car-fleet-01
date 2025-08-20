"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
// src/models/driver.model.ts
const mongoose_1 = require("mongoose");
const advanceSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    settled: { type: Boolean, default: false },
    description: { type: String },
});
const driverSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    licenseNumber: { type: String, required: true },
    aadhaar: { type: String, required: true },
    photo: { type: String },
    vehicleType: { type: String, required: true },
    licenseExpiry: { type: Date, required: true, index: true },
    policeVerificationExpiry: { type: Date, required: true, index: true },
    licenseDocument: { type: String },
    policeVerificationDocument: { type: String },
    paymentMode: { type: String, required: true },
    salary: { type: Number, required: true },
    advances: [advanceSchema],
    status: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Driver = (0, mongoose_1.model)('Driver', driverSchema);
