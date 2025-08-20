"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayments = exports.createPayment = void 0;
// src/services/payment.service.ts
const models_1 = require("../models");
const createPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = new models_1.Payment(data);
    yield payment.save();
    if (data.entityType === 'customer' && data.type === 'received') {
        yield models_1.Company.updateOne({ _id: data.entityId }, { $inc: { outstandingAmount: -data.amount } });
    }
    else if (data.entityType === 'driver' && data.type === 'paid' && data.relatedAdvanceId) {
        yield models_1.Driver.updateOne({ _id: data.entityId, 'advances.id': data.relatedAdvanceId }, { $set: { 'advances.$.settled': true } });
    }
    return payment;
});
exports.createPayment = createPayment;
const getPayments = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [payments, total] = yield Promise.all([
        models_1.Payment.find().skip(skip).limit(limit).sort({ date: -1 }),
        models_1.Payment.countDocuments(),
    ]);
    return { payments, total };
});
exports.getPayments = getPayments;
