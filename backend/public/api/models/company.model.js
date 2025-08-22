"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
// src/models/company.model.ts
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    gst: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    outstandingAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
exports.Company = (0, mongoose_1.model)('Company', companySchema);
