// src/models/company.model.ts
import { Schema, model } from 'mongoose';
import { ICompany } from '../types';

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  gst: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  outstandingAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Company = model<ICompany>('Company', companySchema);