// src/api/models/customer.model.ts
import { Schema, model } from 'mongoose';
import { ICustomer } from '../types';

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Customer = model<ICustomer>('Customer', customerSchema);
