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
exports.settleAdvance = exports.addAdvance = exports.deleteDriver = exports.updateDriver = exports.getDriverById = exports.getDrivers = exports.createDriver = void 0;
// src/services/driver.service.ts
const models_1 = require("../models");
const createDriver = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = new models_1.Driver(Object.assign(Object.assign({}, data), { advances: [] }));
    yield driver.save();
    return driver;
});
exports.createDriver = createDriver;
const getDrivers = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.status)
        query['status'] = filters.status;
    if (filters.paymentMode)
        query['paymentMode'] = filters.paymentMode;
    const skip = (page - 1) * limit;
    const [drivers, total] = yield Promise.all([
        models_1.Driver.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        models_1.Driver.countDocuments(query),
    ]);
    return { drivers, total };
});
exports.getDrivers = getDrivers;
const getDriverById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Driver.findById(id);
});
exports.getDriverById = getDriverById;
const updateDriver = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Driver.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
});
exports.updateDriver = updateDriver;
const deleteDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Driver.findByIdAndDelete(id);
});
exports.deleteDriver = deleteDriver;
const addAdvance = (driverId, advance) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Driver.findByIdAndUpdate(driverId, { $push: { advances: Object.assign(Object.assign({}, advance), { date: new Date() }) } }, { new: true });
});
exports.addAdvance = addAdvance;
const settleAdvance = (driverId, advanceId) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Driver.updateOne({ _id: driverId, 'advances.id': advanceId }, { $set: { 'advances.$.settled': true } });
});
exports.settleAdvance = settleAdvance;
