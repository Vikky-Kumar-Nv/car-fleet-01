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
exports.listPayments = exports.addPayment = exports.removeDutySlip = exports.uploadDutySlips = exports.updateStatus = exports.addExpense = exports.deleteBooking = exports.updateBooking = exports.getBookingById = exports.getBookings = exports.createBooking = void 0;
// src/services/booking.service.ts
const models_1 = require("../models");
const createBooking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = new models_1.Booking(Object.assign(Object.assign({}, data), { balance: data.totalAmount - data.advanceReceived, status: 'booked', expenses: [], dutySlips: [], billed: false, statusHistory: [{
                status: 'booked',
                timestamp: new Date(),
                changedBy: 'System', // or current user
            }] }));
    yield booking.save();
    return booking.populate('companyId driverId vehicleId customerId');
});
exports.createBooking = createBooking;
const getBookings = (page, limit, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (filters.status)
        query['status'] = filters.status;
    if (filters.source)
        query['bookingSource'] = filters.source;
    if (filters.startDate)
        query['startDate'] = { $gte: new Date(filters.startDate) };
    if (filters.endDate)
        query['endDate'] = { $lte: new Date(filters.endDate) };
    if (filters.driverId)
        query['driverId'] = filters.driverId;
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        models_1.Booking.find(query).populate('companyId driverId vehicleId customerId').skip(skip).limit(limit).sort({ startDate: -1 }),
        models_1.Booking.countDocuments(query),
    ]);
    return { bookings, total };
});
exports.getBookings = getBookings;
const getBookingById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.findById(id).populate('companyId driverId vehicleId customerId');
});
exports.getBookingById = getBookingById;
const updateBooking = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const updateDoc = Object.assign({}, updates);
    if (updates.totalAmount !== undefined || updates.advanceReceived !== undefined) {
        // Recompute balance using existing values if one side missing
        const current = yield models_1.Booking.findById(id).select('totalAmount advanceReceived');
        if (current) {
            const total = updates.totalAmount !== undefined ? updates.totalAmount : current.totalAmount;
            const advance = updates.advanceReceived !== undefined ? updates.advanceReceived : current.advanceReceived;
            updateDoc.balance = total - advance;
        }
    }
    if (updates.status) {
        // Use Mongo $push for history while also updating status
        updateDoc.status = updates.status;
        updateDoc.$push = { statusHistory: { status: updates.status, timestamp: new Date(), changedBy: 'System' } };
    }
    return models_1.Booking.findByIdAndUpdate(id, updateDoc, { new: true, runValidators: true }).populate('companyId driverId vehicleId customerId');
});
exports.updateBooking = updateBooking;
const deleteBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.findByIdAndDelete(id);
});
exports.deleteBooking = deleteBooking;
const addExpense = (bookingId, expense) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.findByIdAndUpdate(bookingId, { $push: { expenses: expense } }, { new: true }).populate('companyId driverId vehicleId customerId');
});
exports.addExpense = addExpense;
const updateStatus = (bookingId, status, changedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const change = { status, timestamp: new Date(), changedBy };
    return models_1.Booking.findByIdAndUpdate(bookingId, { status, $push: { statusHistory: change } }, { new: true }).populate('companyId driverId vehicleId customerId');
});
exports.updateStatus = updateStatus;
const uploadDutySlips = (bookingId, files, uploadedBy) => __awaiter(void 0, void 0, void 0, function* () {
    const dutySlips = files.map(file => ({
        path: file.path,
        uploadedBy,
        uploadedAt: new Date(),
        description: `Duty slip uploaded at ${new Date().toISOString()}`,
    }));
    return models_1.Booking.findByIdAndUpdate(bookingId, { $push: { dutySlips: { $each: dutySlips } } }, { new: true }).populate('companyId driverId vehicleId customerId');
});
exports.uploadDutySlips = uploadDutySlips;
const removeDutySlip = (bookingId, dutySlipPath) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.findByIdAndUpdate(bookingId, { $pull: { dutySlips: { path: dutySlipPath } } }, { new: true }).populate('companyId driverId vehicleId customerId');
});
exports.removeDutySlip = removeDutySlip;
const addPayment = (bookingId, payment) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Booking.findByIdAndUpdate(bookingId, { $push: { payments: payment } }, { new: true }).populate('companyId driverId vehicleId customerId');
});
exports.addPayment = addPayment;
const listPayments = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield models_1.Booking.findById(bookingId).select('payments');
    return (booking === null || booking === void 0 ? void 0 : booking.payments) || [];
});
exports.listPayments = listPayments;
