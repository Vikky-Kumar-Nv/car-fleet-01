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
exports.getPaymentsByDriver = exports.getFinanceMetrics = void 0;
const models_1 = require("../models");
const getFinanceMetrics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const [totalRevenue, totalOutstanding, totalExpenses, netProfit] = yield Promise.all([
        models_1.Booking.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        models_1.Company.aggregate([{ $group: { _id: null, total: { $sum: '$outstandingAmount' } } }]),
        models_1.Booking.aggregate([{ $unwind: '$expenses' }, { $group: { _id: null, total: { $sum: '$expenses.amount' } } }]),
        models_1.Booking.aggregate([
            { $group: { _id: null, revenue: { $sum: '$totalAmount' }, expenses: { $sum: '$expenses.amount' } } },
            { $project: { netProfit: { $subtract: ['$revenue', '$expenses'] } } },
        ]),
    ]);
    return {
        totalRevenue: ((_a = totalRevenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
        totalOutstanding: ((_b = totalOutstanding[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
        totalExpenses: ((_c = totalExpenses[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
        netProfit: ((_d = netProfit[0]) === null || _d === void 0 ? void 0 : _d.netProfit) || 0,
    };
});
exports.getFinanceMetrics = getFinanceMetrics;
const getPaymentsByDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    // Populate booking limited fields for linking back in UI
    return models_1.Payment.find({ entityId: driverId, entityType: 'driver' })
        .populate({ path: 'bookingId', select: 'pickupLocation dropLocation startDate endDate _id' })
        .sort({ date: -1 });
});
exports.getPaymentsByDriver = getPaymentsByDriver;
