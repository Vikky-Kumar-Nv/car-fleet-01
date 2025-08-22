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
exports.addServicingEntries = exports.getVehicleServicing = exports.upsertVehicleServicing = void 0;
// src/services/vehicleServicing.service.ts
const models_1 = require("../models");
const upsertVehicleServicing = (vehicleId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure we don't pass _id or vehicleId conflicts in nested docs
    const update = Object.assign({}, data);
    delete update._id;
    update.vehicleId = vehicleId;
    const doc = yield models_1.VehicleServicing.findOneAndUpdate({ vehicleId }, { $set: update }, { new: true, upsert: true });
    return doc;
});
exports.upsertVehicleServicing = upsertVehicleServicing;
const getVehicleServicing = (vehicleId) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.VehicleServicing.findOne({ vehicleId });
});
exports.getVehicleServicing = getVehicleServicing;
const addServicingEntries = (vehicleId, section, entries) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield models_1.VehicleServicing.findOneAndUpdate({ vehicleId }, { $push: { [section]: { $each: entries } }, $setOnInsert: { vehicleId } }, { new: true, upsert: true });
    return doc;
});
exports.addServicingEntries = addServicingEntries;
