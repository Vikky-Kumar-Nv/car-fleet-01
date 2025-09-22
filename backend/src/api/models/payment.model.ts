// src/models/payment.model.ts
import { Schema, model } from 'mongoose';
import { IPayment } from '../types';

const paymentSchema = new Schema<IPayment>({
  entityId: { type: Schema.Types.ObjectId, required: true, index: true },
  entityType: { type: String, required: true, enum: ['customer','driver'] },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: ['received','paid'] },
  date: { type: Date, default: Date.now, index: true },
  description: { type: String },
  relatedAdvanceId: { type: String },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  driverPaymentMode: { type: String, enum: ['per-trip','daily','fuel-basis'] },
  fuelQuantity: { type: Number },
  fuelRate: { type: Number },
  computedAmount: { type: Number },
  // For fuel-basis payments: allow deriving fuelQuantity from distance and mileage
  distanceKm: { type: Number },
  mileage: { type: Number },
  settled: { type: Boolean, default: false },
  settledAt: { type: Date },
});

export const Payment = model<IPayment>('Payment', paymentSchema);