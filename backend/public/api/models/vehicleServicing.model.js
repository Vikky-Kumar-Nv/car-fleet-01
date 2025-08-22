"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleServicing = void 0;
// src/models/vehicleServicing.model.ts
const mongoose_1 = require("mongoose");
const datedNumberFields = { date: { type: Date, default: Date.now }, price: Number };
const oilChangeSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    kilometers: { type: Number, required: true },
}, { _id: true });
const partReplacementSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    part: { type: String, required: true },
    price: { type: Number, required: true },
}, { _id: true });
const tyreSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    details: { type: String, required: true },
    price: { type: Number, required: true },
}, { _id: true });
const installmentSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
}, { _id: true });
const insuranceSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    provider: String,
    policyNumber: String,
    cost: { type: Number, required: true },
    validFrom: Date,
    validTo: Date,
}, { _id: true });
const legalPaperSchema = new mongoose_1.Schema({
    date: { type: Date, default: Date.now },
    type: { type: String, required: true },
    description: String,
    cost: { type: Number, required: true },
    expiryDate: Date,
}, { _id: true });
const vehicleServicingSchema = new mongoose_1.Schema({
    vehicleId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle', required: true, unique: true, index: true },
    oilChanges: [oilChangeSchema],
    partsReplacements: [partReplacementSchema],
    tyres: [tyreSchema],
    installments: [installmentSchema],
    insurances: [insuranceSchema],
    legalPapers: [legalPaperSchema],
}, { timestamps: true });
exports.VehicleServicing = (0, mongoose_1.model)('VehicleServicing', vehicleServicingSchema);
