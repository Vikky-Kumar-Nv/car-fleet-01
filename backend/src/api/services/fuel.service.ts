// src/api/services/fuel.service.ts
import { Types } from 'mongoose';
import { FuelEntry } from '../models/fuel.model';
import { IFuelEntry } from '../types';

interface FuelCreate {
  vehicleId: string;
  bookingId: string;
  addedByType: 'self' | 'driver';
  fuelFillDate: Date;
  totalTripKm: number;
  vehicleFuelAverage: number;
  fuelQuantity: number;
  fuelRate: number;
  comment?: string;
  includeInFinance: boolean;
}

export interface FuelUpdate {
  fuelFillDate?: Date;
  totalTripKm?: number;
  vehicleFuelAverage?: number;
  fuelQuantity?: number;
  fuelRate?: number;
  comment?: string;
  includeInFinance?: boolean;
}

export async function createFuelEntry(data: FuelCreate): Promise<IFuelEntry> {
  const totalAmount = data.fuelQuantity * data.fuelRate;
  const doc = await FuelEntry.create({
    vehicleId: new Types.ObjectId(data.vehicleId),
    bookingId: new Types.ObjectId(data.bookingId),
    addedByType: data.addedByType,
    fuelFillDate: data.fuelFillDate,
    totalTripKm: data.totalTripKm,
    vehicleFuelAverage: data.vehicleFuelAverage,
    fuelQuantity: data.fuelQuantity,
    fuelRate: data.fuelRate,
    totalAmount,
    comment: data.comment,
    includeInFinance: data.includeInFinance,
  });
  return doc.toObject() as IFuelEntry;
}

export async function listFuelEntries(vehicleId?: string, bookingId?: string) {
  const query: any = {};
  if (vehicleId) query.vehicleId = vehicleId;
  if (bookingId) query.bookingId = bookingId;
  return FuelEntry.find(query)
    .populate('vehicleId', 'registrationNumber')
    .populate('bookingId', 'pickupLocation dropLocation')
    .sort({ fuelFillDate: -1 })
    .lean();
}

export async function getFuelEntry(id: string) {
  return FuelEntry.findById(id).lean();
}

export async function deleteFuelEntry(id: string) {
  await FuelEntry.findByIdAndDelete(id);
}

export async function updateFuelEntry(id: string, updates: FuelUpdate) {
  const doc = await FuelEntry.findById(id);
  if (!doc) return null;
  if (updates.fuelFillDate) doc.fuelFillDate = updates.fuelFillDate;
  if (typeof updates.totalTripKm === 'number') doc.totalTripKm = updates.totalTripKm;
  if (typeof updates.vehicleFuelAverage === 'number') doc.vehicleFuelAverage = updates.vehicleFuelAverage;
  if (typeof updates.fuelQuantity === 'number') doc.fuelQuantity = updates.fuelQuantity;
  if (typeof updates.fuelRate === 'number') doc.fuelRate = updates.fuelRate;
  if (typeof updates.includeInFinance === 'boolean') doc.includeInFinance = updates.includeInFinance;
  if (updates.comment !== undefined) doc.comment = updates.comment;
  // recompute total
  doc.totalAmount = doc.fuelQuantity * doc.fuelRate;
  await doc.save();
  return doc.toObject();
}
