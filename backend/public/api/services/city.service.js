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
exports.deleteCity = exports.createCity = exports.listCities = void 0;
const city_model_1 = require("../models/city.model");
const listCities = () => __awaiter(void 0, void 0, void 0, function* () {
    return city_model_1.City.find().sort({ name: 1 });
});
exports.listCities = listCities;
const createCity = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield city_model_1.City.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (exists)
        return exists;
    const city = new city_model_1.City({ name });
    yield city.save();
    return city;
});
exports.createCity = createCity;
const deleteCity = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield city_model_1.City.findByIdAndDelete(id);
});
exports.deleteCity = deleteCity;
