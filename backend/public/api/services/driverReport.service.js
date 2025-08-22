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
exports.listAllDriversReportsForMonth = exports.listDriverReportsForMonth = exports.getDriverReportEntry = exports.upsertDriverReportEntry = void 0;
const models_1 = require("../models");
const upsertDriverReportEntry = (driverId, date, data) => __awaiter(void 0, void 0, void 0, function* () {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    const update = Object.assign(Object.assign({}, data), { driverId, date: normalized });
    delete update._id;
    const doc = yield models_1.DriverReport.findOneAndUpdate({ driverId, date: normalized }, { $set: update }, { new: true, upsert: true });
    return doc;
});
exports.upsertDriverReportEntry = upsertDriverReportEntry;
const getDriverReportEntry = (driverId, date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return models_1.DriverReport.findOne({ driverId, date: normalized });
};
exports.getDriverReportEntry = getDriverReportEntry;
const monthRange = (year, month) => {
    const start = new Date(year, month, 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(year, month + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
const listDriverReportsForMonth = (driverId, year, month) => {
    const { start, end } = monthRange(year, month);
    return models_1.DriverReport.find({ driverId, date: { $gte: start, $lte: end } }).sort({ date: 1 });
};
exports.listDriverReportsForMonth = listDriverReportsForMonth;
const listAllDriversReportsForMonth = (year, month) => {
    const { start, end } = monthRange(year, month);
    return models_1.DriverReport.find({ date: { $gte: start, $lte: end } });
};
exports.listAllDriversReportsForMonth = listAllDriversReportsForMonth;
