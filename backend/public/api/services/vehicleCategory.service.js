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
exports.deleteVehicleCategory = exports.updateVehicleCategory = exports.getVehicleCategoryById = exports.getVehicleCategories = exports.createVehicleCategory = void 0;
// src/services/vehicleCategory.service.ts
const models_1 = require("../models");
const createVehicleCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const category = new models_1.VehicleCategory(data);
    yield category.save();
    return category;
});
exports.createVehicleCategory = createVehicleCategory;
const getVehicleCategories = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [categories, total] = yield Promise.all([
        models_1.VehicleCategory.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        models_1.VehicleCategory.countDocuments(),
    ]);
    return { categories, total };
});
exports.getVehicleCategories = getVehicleCategories;
const getVehicleCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.VehicleCategory.findById(id);
});
exports.getVehicleCategoryById = getVehicleCategoryById;
const updateVehicleCategory = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.VehicleCategory.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
});
exports.updateVehicleCategory = updateVehicleCategory;
const deleteVehicleCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.VehicleCategory.findByIdAndDelete(id);
});
exports.deleteVehicleCategory = deleteVehicleCategory;
