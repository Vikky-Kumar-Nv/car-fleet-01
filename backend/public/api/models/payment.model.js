"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
// src/models/payment.model.ts
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    entityId: { type: mongoose_1.Schema.Types.ObjectId, required: true, index: true },
    entityType: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true },
    description: { type: String },
    relatedAdvanceId: { type: String },
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
