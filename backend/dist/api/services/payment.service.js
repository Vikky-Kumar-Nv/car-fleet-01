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
exports.deleteDriverBookingPayment = exports.updateDriverBookingPayment = exports.listDriverBookingPayments = exports.createDriverBookingPayment = exports.getPayments = exports.createPayment = void 0;
// src/services/payment.service.ts
const models_1 = require("../models");
const createPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = new models_1.Payment(data);
    yield payment.save();
    if (data.entityType === 'customer' && data.type === 'received') {
        yield models_1.Company.updateOne({ _id: data.entityId }, { $inc: { outstandingAmount: -data.amount } });
    }
    else if (data.entityType === 'driver' && data.type === 'paid' && data.relatedAdvanceId) {
        yield models_1.Driver.updateOne({ _id: data.entityId, 'advances.id': data.relatedAdvanceId }, { $set: { 'advances.$.settled': true } });
    }
    return payment;
});
exports.createPayment = createPayment;
const getPayments = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [payments, total] = yield Promise.all([
        models_1.Payment.find().skip(skip).limit(limit).sort({ date: -1 }),
        models_1.Payment.countDocuments(),
    ]);
    return { payments, total };
});
exports.getPayments = getPayments;
// Create a driver payment tied to a booking (per-trip, daily, or fuel-basis)
const createDriverBookingPayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure booking exists and matches driver if driver assigned
    const booking = yield models_1.Booking.findById(data.bookingId).select('driverId');
    if (!booking)
        throw new Error('Booking not found');
    if (booking.driverId && booking.driverId.toString() !== data.driverId) {
        throw new Error('Driver does not match booking');
    }
    let fuelQuantity = data.fuelQuantity;
    if (data.mode === 'fuel-basis' && (fuelQuantity === undefined || fuelQuantity === null)) {
        if (data.distanceKm !== undefined && data.mileage && data.mileage > 0) {
            fuelQuantity = data.distanceKm / data.mileage;
        }
    }
    const computedAmount = data.mode === 'fuel-basis' && fuelQuantity !== undefined && data.fuelRate !== undefined
        ? fuelQuantity * data.fuelRate
        : undefined;
    const amount = data.mode === 'fuel-basis' ? (computedAmount || 0) : (data.amount || 0);
    const paymentDoc = {
        entityId: booking.driverId || data.driverId,
        entityType: 'driver',
        amount,
        type: 'paid',
        date: new Date(),
        description: data.description || `${data.mode} driver payment`,
        relatedAdvanceId: undefined,
        bookingId: booking._id,
        driverPaymentMode: data.mode,
        fuelQuantity,
        fuelRate: data.fuelRate,
        computedAmount,
        distanceKm: data.distanceKm,
        mileage: data.mileage,
    };
    const payment = new models_1.Payment(paymentDoc);
    yield payment.save();
    return payment;
});
exports.createDriverBookingPayment = createDriverBookingPayment;
const listDriverBookingPayments = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Payment.find({ bookingId, entityType: 'driver' }).sort({ date: -1 });
});
exports.listDriverBookingPayments = listDriverBookingPayments;
const updateDriverBookingPayment = (paymentId, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = Object.assign({}, updates);
    if (updates.mode === 'fuel-basis') {
        let fQty = updates.fuelQuantity;
        if ((fQty === undefined || fQty === null) && updates.distanceKm !== undefined && updates.mileage && updates.mileage > 0) {
            fQty = updates.distanceKm / updates.mileage;
            doc.fuelQuantity = fQty;
        }
        if (fQty !== undefined && updates.fuelRate !== undefined) {
            doc.amount = fQty * updates.fuelRate; // recompute
            doc.computedAmount = doc.amount;
        }
    }
    if (updates.settle) {
        doc.settled = true;
        doc.settledAt = new Date();
    }
    delete doc.settle;
    return models_1.Payment.findByIdAndUpdate(paymentId, doc, { new: true });
});
exports.updateDriverBookingPayment = updateDriverBookingPayment;
const deleteDriverBookingPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return models_1.Payment.findByIdAndDelete(paymentId);
});
exports.deleteDriverBookingPayment = deleteDriverBookingPayment;
