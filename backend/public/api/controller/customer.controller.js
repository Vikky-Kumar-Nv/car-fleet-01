"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const service = __importStar(require("../services"));
const validation_1 = require("../validation");
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.customerSchema.parse(req.body);
    const customer = yield service.createCustomer(data); // service handles ObjectId conversion
    res.status(201).json(customer);
});
exports.createCustomer = createCustomer;
const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const result = yield service.getCustomers(page, limit);
    res.json(result);
});
exports.getCustomers = getCustomers;
const getCustomerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield service.getCustomerById(req.params.id);
    if (!customer)
        return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
});
exports.getCustomerById = getCustomerById;
const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.updateCustomerSchema.parse(req.body);
    const customer = yield service.updateCustomer(req.params.id, data);
    if (!customer)
        return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
});
exports.updateCustomer = updateCustomer;
const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield service.deleteCustomer(req.params.id);
    res.status(204).send();
});
exports.deleteCustomer = deleteCustomer;
