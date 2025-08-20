// src/models/vehicle.model.ts
import { Schema, model } from 'mongoose';
import { IVehicle } from '../types';

const vehicleSchema = new Schema<IVehicle>({
  registrationNumber: { type: String, required: true, unique: true, index: true },
  category: { type: String, required: true },
  owner: { type: String, required: true },
  insuranceExpiry: { type: Date, required: true, index: true },
  fitnessExpiry: { type: Date, required: true, index: true },
  permitExpiry: { type: Date, required: true, index: true },
  pollutionExpiry: { type: Date, required: true, index: true },
  status: { type: String, required: true, index: true },
  mileageTrips: { type: Number },
  mileageKm: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export const Vehicle = model<IVehicle>('Vehicle', vehicleSchema);