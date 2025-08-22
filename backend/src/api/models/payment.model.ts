// src/models/payment.model.ts
import { Schema, model } from 'mongoose';
import { IPayment } from '../types';

const paymentSchema = new Schema<IPayment>({
  entityId: { type: Schema.Types.ObjectId, required: true, index: true },
  entityType: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now, index: true },
  description: { type: String },
  relatedAdvanceId: { type: String },
});

export const Payment = model<IPayment>('Payment', paymentSchema);