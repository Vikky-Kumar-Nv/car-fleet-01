// src/api/models/fuel.model.ts
import { Schema, model } from 'mongoose';
import { IFuelEntry } from '../types';

const fuelSchema = new Schema<IFuelEntry>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  addedByType: { type: String, enum: ['self','driver'], required: true },
  fuelFillDate: { type: Date, required: true, index: true },
  totalTripKm: { type: Number, required: true },
  vehicleFuelAverage: { type: Number, required: true },
  fuelQuantity: { type: Number, required: true },
  fuelRate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  comment: { type: String },
  includeInFinance: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

fuelSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

export const FuelEntry = model<IFuelEntry>('FuelEntry', fuelSchema);
