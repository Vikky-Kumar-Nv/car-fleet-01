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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getPayments = exports.addPayment = exports.removeDutySlip = exports.uploadDutySlips = exports.updateStatus = exports.addExpense = exports.deleteBooking = exports.updateBooking = exports.getBookingById = exports.getBookings = exports.createBooking = void 0;
const mongoose_1 = require("mongoose");
const service = __importStar(require("../services"));
const validation_1 = require("../validation");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.bookingSchema.parse(req.body);
    const bookingData = Object.assign(Object.assign({}, data), { customerId: data.customerId ? new mongoose_1.Types.ObjectId(data.customerId) : undefined, companyId: data.companyId ? new mongoose_1.Types.ObjectId(data.companyId) : undefined, vehicleId: data.vehicleId ? new mongoose_1.Types.ObjectId(data.vehicleId) : undefined, driverId: data.driverId ? new mongoose_1.Types.ObjectId(data.driverId) : undefined, startDate: new Date(data.startDate), endDate: new Date(data.endDate), status: 'booked' });
    const booking = yield service.createBooking(bookingData);
    res.status(201).json(booking);
});
exports.createBooking = createBooking;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = { status: req.query.status, source: req.query.source, startDate: req.query.startDate, endDate: req.query.endDate, driverId: req.query.driverId };
    const result = yield service.getBookings(page, limit, filters);
    res.json(result);
});
exports.getBookings = getBookings;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield service.getBookingById(req.params.id);
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.getBookingById = getBookingById;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.updateBookingSchema.parse(req.body);
    const updateData = Object.assign({}, data);
    // Convert string IDs to ObjectIds
    if (updateData.companyId)
        updateData.companyId = new mongoose_1.Types.ObjectId(updateData.companyId);
    if (updateData.vehicleId)
        updateData.vehicleId = new mongoose_1.Types.ObjectId(updateData.vehicleId);
    if (updateData.driverId)
        updateData.driverId = new mongoose_1.Types.ObjectId(updateData.driverId);
    if (updateData.customerId)
        updateData.customerId = new mongoose_1.Types.ObjectId(updateData.customerId);
    // Convert date strings to Date objects
    if (updateData.startDate)
        updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate)
        updateData.endDate = new Date(updateData.endDate);
    const booking = yield service.updateBooking(req.params.id, updateData);
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.updateBooking = updateBooking;
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield service.deleteBooking(req.params.id);
    res.status(204).send();
});
exports.deleteBooking = deleteBooking;
const addExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.expenseSchema.parse(req.body);
    const booking = yield service.addExpense(req.params.id, data);
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.addExpense = addExpense;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, changedBy } = validation_1.statusSchema.parse(req.body);
    const booking = yield service.updateStatus(req.params.id, status, changedBy || 'System');
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.updateStatus = updateStatus;
const uploadDutySlips = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files || [];
    const uploadedBy = req.body.uploadedBy || 'System'; // Get from request body or use default
    const booking = yield service.uploadDutySlips(req.params.id, files, uploadedBy);
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.uploadDutySlips = uploadDutySlips;
const removeDutySlip = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { path } = req.body;
    const booking = yield service.removeDutySlip(req.params.id, path);
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.removeDutySlip = removeDutySlip;
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = validation_1.bookingPaymentSchema.parse(req.body);
    const payment = Object.assign(Object.assign({}, data), { paidOn: new Date(data.paidOn) });
    const booking = yield service.addPayment(req.params.id, payment);
    if (!booking)
        return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
});
exports.addPayment = addPayment;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield service.listPayments(req.params.id);
    res.json(payments);
});
exports.getPayments = getPayments;
