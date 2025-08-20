// src/services/vehicle.service.ts
import { Vehicle } from '../models';
import { IVehicle } from '../types';

export const createVehicle = async (data: Omit<IVehicle, '_id' | 'createdAt'>) => {
  const vehicle = new Vehicle(data);
  await vehicle.save();
  return vehicle;
};

export const getVehicles = async (page: number, limit: number, filters: any) => {
  const query: Record<string, any> = {};
  if (filters.status) query['status'] = filters.status;
  if (filters.owner) query['owner'] = filters.owner;
  if (filters.category) query['category'] = filters.category;
  const skip = (page - 1) * limit;
  const [vehicles, total] = await Promise.all([
    Vehicle.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Vehicle.countDocuments(query),
  ]);
  return { vehicles, total };
};

export const getVehicleById = async (id: string) => {
  return Vehicle.findById(id);
};

export const updateVehicle = async (id: string, updates: Partial<IVehicle>) => {
  return Vehicle.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

export const deleteVehicle = async (id: string) => {
  return Vehicle.findByIdAndDelete(id);
};