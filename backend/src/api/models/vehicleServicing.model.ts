// src/models/vehicleServicing.model.ts
import { Schema, model } from 'mongoose';
import { IVehicleServicing } from '../types';

const datedNumberFields = { date: { type: Date, default: Date.now }, price: Number };

const oilChangeSchema = new Schema({
  date: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  kilometers: { type: Number, required: true },
}, { _id: true });

const partReplacementSchema = new Schema({
  date: { type: Date, default: Date.now },
  part: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: true });

const tyreSchema = new Schema({
  date: { type: Date, default: Date.now },
  details: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: true });

const installmentSchema = new Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
}, { _id: true });

const insuranceSchema = new Schema({
  date: { type: Date, default: Date.now },
  provider: String,
  policyNumber: String,
  cost: { type: Number, required: true },
  validFrom: Date,
  validTo: Date,
}, { _id: true });

const legalPaperSchema = new Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, required: true },
  description: String,
  cost: { type: Number, required: true },
  expiryDate: Date,
}, { _id: true });

const vehicleServicingSchema = new Schema<IVehicleServicing>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, unique: true, index: true },
  oilChanges: [oilChangeSchema],
  partsReplacements: [partReplacementSchema],
  tyres: [tyreSchema],
  installments: [installmentSchema],
  insurances: [insuranceSchema],
  legalPapers: [legalPaperSchema],
}, { timestamps: true });

export const VehicleServicing = model<IVehicleServicing>('VehicleServicing', vehicleServicingSchema);
