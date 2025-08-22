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
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
// src/api/services/customer.service.ts
const models_1 = require("../models");
const mongoose_1 = require("mongoose");
const createCustomer = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = new models_1.Customer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        companyId: data.companyId ? new mongoose_1.Types.ObjectId(data.companyId) : undefined,
    });
    yield customer.save();
    return customer;
});
exports.createCustomer = createCustomer;
const getCustomers = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [customers, total] = yield Promise.all([
        models_1.Customer.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        models_1.Customer.countDocuments(),
    ]);
    return { customers, total };
});
exports.getCustomers = getCustomers;
const getCustomerById = (id) => __awaiter(void 0, void 0, void 0, function* () { return models_1.Customer.findById(id); });
exports.getCustomerById = getCustomerById;
const updateCustomer = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const mapped = Object.assign({}, updates);
    if (mapped.companyId && typeof mapped.companyId === 'string') {
        mapped.companyId = new mongoose_1.Types.ObjectId(mapped.companyId);
    }
    return models_1.Customer.findByIdAndUpdate(id, mapped, { new: true });
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (id) => __awaiter(void 0, void 0, void 0, function* () { return models_1.Customer.findByIdAndDelete(id); });
exports.deleteCustomer = deleteCustomer;
