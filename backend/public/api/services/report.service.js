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
exports.getExpenseBreakdown = exports.getVehicleUsage = exports.getDriverPerformance = exports.getMonthlyEarnings = void 0;
// src/services/report.service.ts
const models_1 = require("../models");
const getMonthlyEarnings = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const aggregate = yield models_1.Booking.aggregate([
        { $match: { startDate: { $gte: start, $lte: end } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$startDate' } },
                earnings: { $sum: '$totalAmount' },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    return aggregate.map(({ _id, earnings }) => ({ month: _id, earnings }));
});
exports.getMonthlyEarnings = getMonthlyEarnings;
const getDriverPerformance = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    const aggregate = yield models_1.Booking.aggregate([
        { $match: { startDate: { $gte: start, $lte: end } } },
        {
            $group: {
                _id: '$driverId',
                trips: { $sum: 1 },
                earnings: { $sum: '$totalAmount' },
            },
        },
        { $lookup: { from: 'drivers', localField: '_id', foreignField: '_id', as: 'driver' } },
        { $unwind: '$driver' },
        { $project: { driver: '$driver.name', trips: 1, earnings: 1 } },
    ]);
    return aggregate;
});
exports.getDriverPerformance = getDriverPerformance;
// Similar for vehicle usage and expense breakdown
// ...
const getVehicleUsage = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.aggregate([
        { $match: { startDate: { $gte: start, $lte: end }, vehicleId: { $ne: null } } },
        { $group: { _id: '$vehicleId', trips: { $sum: 1 }, totalDistance: { $sum: 100 } } }, // Placeholder for distance
        { $lookup: { from: 'vehicles', localField: '_id', foreignField: '_id', as: 'vehicle' } },
        { $unwind: '$vehicle' },
        { $project: { vehicle: '$vehicle.registrationNumber', trips: 1, totalDistance: 1 } },
    ]);
});
exports.getVehicleUsage = getVehicleUsage;
const getExpenseBreakdown = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.aggregate([
        { $match: { startDate: { $gte: start, $lte: end } } },
        { $unwind: '$expenses' },
        {
            $group: {
                _id: '$expenses.type',
                total: { $sum: '$expenses.amount' },
            },
        },
    ]);
});
exports.getExpenseBreakdown = getExpenseBreakdown;
