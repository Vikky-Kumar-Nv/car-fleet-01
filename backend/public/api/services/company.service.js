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
exports.recordPayment = exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getCompanies = exports.createCompany = void 0;
// src/services/company.service.ts
const models_1 = require("../models");
const createCompany = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const company = new models_1.Company(Object.assign(Object.assign({}, data), { outstandingAmount: 0 }));
    yield company.save();
    return company;
});
exports.createCompany = createCompany;
const getCompanies = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.outstandingGt)
        query['outstandingAmount'] = { $gt: Number(filters.outstandingGt) };
    if (filters.minOutstanding)
        query['outstandingAmount'] = { $gte: Number(filters.minOutstanding) };
    if (filters.startDate)
        query['createdAt'] = { $gte: new Date(filters.startDate) };
    if (filters.endDate)
        query['createdAt'] = { $lte: new Date(filters.endDate) };
    const skip = (page - 1) * limit;
    const [companies, total] = yield Promise.all([
        models_1.Company.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
        models_1.Company.countDocuments(query),
    ]);
    return { companies, total };
});
exports.getCompanies = getCompanies;
const getCompanyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Company.findById(id);
});
exports.getCompanyById = getCompanyById;
const updateCompany = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Company.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
});
exports.updateCompany = updateCompany;
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Company.findByIdAndDelete(id);
});
exports.deleteCompany = deleteCompany;
const recordPayment = (companyId, amount, description) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Company.updateOne({ _id: companyId }, { $inc: { outstandingAmount: -amount } });
    // add to payments via payment.service
});
exports.recordPayment = recordPayment;
