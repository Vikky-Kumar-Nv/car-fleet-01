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
exports.createFuelEntry = createFuelEntry;
exports.listFuelEntries = listFuelEntries;
exports.getFuelEntry = getFuelEntry;
exports.deleteFuelEntry = deleteFuelEntry;
exports.updateFuelEntry = updateFuelEntry;
// src/api/services/fuel.service.ts
const mongoose_1 = require("mongoose");
const fuel_model_1 = require("../models/fuel.model");
function createFuelEntry(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalAmount = data.fuelQuantity * data.fuelRate;
        const doc = yield fuel_model_1.FuelEntry.create({
            vehicleId: new mongoose_1.Types.ObjectId(data.vehicleId),
            bookingId: new mongoose_1.Types.ObjectId(data.bookingId),
            addedByType: data.addedByType,
            fuelFillDate: data.fuelFillDate,
            totalTripKm: data.totalTripKm,
            vehicleFuelAverage: data.vehicleFuelAverage,
            fuelQuantity: data.fuelQuantity,
            fuelRate: data.fuelRate,
            totalAmount,
            comment: data.comment,
            includeInFinance: data.includeInFinance,
        });
        return doc.toObject();
    });
}
function listFuelEntries(vehicleId, bookingId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {};
        if (vehicleId)
            query.vehicleId = vehicleId;
        if (bookingId)
            query.bookingId = bookingId;
        return fuel_model_1.FuelEntry.find(query)
            .populate('vehicleId', 'registrationNumber')
            .populate('bookingId', 'pickupLocation dropLocation')
            .sort({ fuelFillDate: -1 })
            .lean();
    });
}
function getFuelEntry(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return fuel_model_1.FuelEntry.findById(id).lean();
    });
}
function deleteFuelEntry(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fuel_model_1.FuelEntry.findByIdAndDelete(id);
    });
}
function updateFuelEntry(id, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = yield fuel_model_1.FuelEntry.findById(id);
        if (!doc)
            return null;
        if (updates.fuelFillDate)
            doc.fuelFillDate = updates.fuelFillDate;
        if (typeof updates.totalTripKm === 'number')
            doc.totalTripKm = updates.totalTripKm;
        if (typeof updates.vehicleFuelAverage === 'number')
            doc.vehicleFuelAverage = updates.vehicleFuelAverage;
        if (typeof updates.fuelQuantity === 'number')
            doc.fuelQuantity = updates.fuelQuantity;
        if (typeof updates.fuelRate === 'number')
            doc.fuelRate = updates.fuelRate;
        if (typeof updates.includeInFinance === 'boolean')
            doc.includeInFinance = updates.includeInFinance;
        if (updates.comment !== undefined)
            doc.comment = updates.comment;
        // recompute total
        doc.totalAmount = doc.fuelQuantity * doc.fuelRate;
        yield doc.save();
        return doc.toObject();
    });
}
