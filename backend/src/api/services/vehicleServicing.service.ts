// src/services/vehicleServicing.service.ts
import { VehicleServicing } from '../models';
import { IVehicleServicing } from '../types';

export const upsertVehicleServicing = async (vehicleId: string, data: Partial<IVehicleServicing>) => {
  // Ensure we don't pass _id or vehicleId conflicts in nested docs
  const update: any = { ...data };
  delete update._id;
  update.vehicleId = vehicleId;
  const doc = await VehicleServicing.findOneAndUpdate(
    { vehicleId },
    { $set: update },
    { new: true, upsert: true }
  );
  return doc;
};

export const getVehicleServicing = async (vehicleId: string) => {
  return VehicleServicing.findOne({ vehicleId });
};

export const addServicingEntries = async (vehicleId: string, section: keyof Omit<IVehicleServicing,'_id'|'vehicleId'|'createdAt'|'updatedAt'>, entries: any[]) => {
  const doc = await VehicleServicing.findOneAndUpdate(
    { vehicleId },
    { $push: { [section]: { $each: entries } }, $setOnInsert: { vehicleId } },
    { new: true, upsert: true }
  );
  return doc;
};
