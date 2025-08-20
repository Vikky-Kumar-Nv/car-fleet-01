// src/models/booking.model.ts
import { Schema, model } from 'mongoose';
import { IBooking, IExpense, IStatusChange } from '../types';

const expenseSchema = new Schema<IExpense>({
  type: { type: String, required: true, enum: ['fuel', 'toll', 'parking', 'other'] },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  receipt: { type: String },
});

const statusChangeSchema = new Schema<IStatusChange>({
  status: { type: String, required: true, enum: ['booked', 'ongoing', 'completed'] },
  timestamp: { type: Date, default: Date.now },
  changedBy: { type: String, required: true },
});

const dutySlipSchema = new Schema({
  path: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  description: { type: String },
});

const bookingSchema = new Schema<IBooking>({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  bookingSource: { type: String, required: true, enum: ['company', 'travel-agency', 'individual'] },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  journeyType: { type: String, required: true, enum: ['outstation', 'local', 'one-way', 'round-trip'] },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
  tariffRate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  advanceReceived: { type: Number, required: true },
  balance: { type: Number, required: true },
  status: { type: String, required: true, enum: ['booked', 'ongoing', 'completed'], index: true },
  dutySlips: [dutySlipSchema],
  expenses: [expenseSchema],
  billed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
  statusHistory: [statusChangeSchema],
});

export const Booking = model<IBooking>('Booking', bookingSchema);