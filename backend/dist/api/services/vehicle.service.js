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
exports.deleteVehicle = exports.updateVehicle = exports.getVehicleById = exports.getVehicles = exports.createVehicle = void 0;
// src/services/vehicle.service.ts
const models_1 = require("../models");
const createVehicle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const vehicle = new models_1.Vehicle(data);
    yield vehicle.save();
    return vehicle;
});
exports.createVehicle = createVehicle;
const getVehicles = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.status)
        query['status'] = filters.status;
    if (filters.owner)
        query['owner'] = filters.owner;
    if (filters.category)
        query['category'] = filters.category;
    const skip = (page - 1) * limit;
    const [vehicles, total] = yield Promise.all([
        models_1.Vehicle.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        models_1.Vehicle.countDocuments(query),
    ]);
    return { vehicles, total };
});
exports.getVehicles = getVehicles;
const getVehicleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Vehicle.findById(id);
});
exports.getVehicleById = getVehicleById;
const updateVehicle = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Vehicle.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
});
exports.updateVehicle = updateVehicle;
const deleteVehicle = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Vehicle.findByIdAndDelete(id);
});
exports.deleteVehicle = deleteVehicle;
