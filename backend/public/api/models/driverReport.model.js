"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverReport = void 0;
const mongoose_1 = require("mongoose");
const driverReportSchema = new mongoose_1.Schema({
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
    date: { type: Date, required: true, index: true },
    totalKm: { type: Number },
    daysWorked: { type: Number },
    nightsWorked: { type: Number },
    nightAmount: { type: Number },
    salaryRate: { type: Number },
    totalAmount: { type: Number },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
driverReportSchema.index({ driverId: 1, date: 1 }, { unique: true });
driverReportSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.DriverReport = (0, mongoose_1.model)('DriverReport', driverReportSchema);
