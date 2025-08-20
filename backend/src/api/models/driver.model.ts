// src/models/driver.model.ts
import { Schema, model } from 'mongoose';
import { IDriver } from '../types';

const advanceSchema = new Schema<IDriver['advances'][0]>({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  settled: { type: Boolean, default: false },
  description: { type: String },
});

const driverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  phone: { type: String, required: true, index: true },
  licenseNumber: { type: String, required: true },
  aadhaar: { type: String, required: true },
  photo: { type: String },
  vehicleType: { type: String, required: true },
  licenseExpiry: { type: Date, required: true, index: true },
  policeVerificationExpiry: { type: Date, required: true, index: true },
  licenseDocument: { type: String },
  policeVerificationDocument: { type: String },
  paymentMode: { type: String, required: true },
  salary: { type: Number, required: true },
  advances: [advanceSchema],
  status: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

export const Driver = model<IDriver>('Driver', driverSchema);