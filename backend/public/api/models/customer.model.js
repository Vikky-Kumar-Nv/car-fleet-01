"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
// src/api/models/customer.model.ts
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: false, index: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Customer = (0, mongoose_1.model)('Customer', customerSchema);
