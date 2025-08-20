// src/types/index.ts
import { Types } from 'mongoose';
import { Request } from 'express';

export type UserRole = 'admin' | 'accountant' | 'dispatcher' | 'driver' | 'customer';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  password: string; // hashed
}

export interface IDriver {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  licenseNumber: string;
  aadhaar: string;
  photo?: string; // file path
  vehicleType: 'owned' | 'rented';
  licenseExpiry: Date;
  policeVerificationExpiry: Date;
  licenseDocument?: string; // file path
  policeVerificationDocument?: string; // file path
  paymentMode: 'per-trip' | 'daily' | 'monthly' | 'fuel-basis';
  salary: number;
  advances: IAdvance[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface IVehicle {
  _id: Types.ObjectId;
  registrationNumber: string;
  category: 'SUV' | 'sedan' | 'bus' | 'mini-bus';
  owner: 'owned' | 'rented';
  insuranceExpiry: Date;
  fitnessExpiry: Date;
  permitExpiry: Date;
  pollutionExpiry: Date;
  status: 'active' | 'maintenance' | 'inactive';
  mileageTrips?: number;
  mileageKm?: number;
  createdAt: Date;
}

export interface ICompany {
  _id: Types.ObjectId;
  name: string;
  gst: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  outstandingAmount: number;
  createdAt: Date;
}

// ...existing code...

export interface IExpense {
  type: 'fuel' | 'toll' | 'parking' | 'other';
  amount: number;
  description: string;
  receipt?: string; // file path
}

export interface IStatusChange {
  status: IBooking['status'];
  timestamp: Date;
  changedBy: string;
}

export interface IAdvance {
  amount: number;
  date: Date;
  settled: boolean;
  description: string;
}

export interface IPayment {
  _id: Types.ObjectId;
  entityId: Types.ObjectId;
  entityType: 'customer' | 'driver';
  amount: number;
  type: 'received' | 'paid';
  date: Date;
  description: string;
  relatedAdvanceId?: string;
}

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole };
}



export interface IDutySlip {
  path: string;
  uploadedBy: string;
  uploadedAt: Date;
  description?: string;
}

export interface IBooking {
  _id: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  bookingSource: 'company' | 'travel-agency' | 'individual';
  companyId?: Types.ObjectId;
  pickupLocation: string;
  dropLocation: string;
  journeyType: 'outstation' | 'local' | 'one-way' | 'round-trip';
  startDate: Date;
  endDate: Date;
  vehicleId?: Types.ObjectId;
  driverId?: Types.ObjectId;
  tariffRate: number;
  totalAmount: number;
  advanceReceived: number;
  balance: number;
  status: 'booked' | 'ongoing' | 'completed';
  dutySlips?: IDutySlip[];
  expenses: IExpense[];
  billed: boolean;
  createdAt: Date;
  statusHistory: IStatusChange[];
}