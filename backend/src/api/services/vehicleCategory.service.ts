// src/services/vehicleCategory.service.ts
import { VehicleCategory } from '../models';
import { IVehicleCategory } from '../types';

export const createVehicleCategory = async (data: Omit<IVehicleCategory, '_id' | 'createdAt'>) => {
  const category = new VehicleCategory(data);
  await category.save();
  return category;
};

export const getVehicleCategories = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [categories, total] = await Promise.all([
    VehicleCategory.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    VehicleCategory.countDocuments(),
  ]);
  return { categories, total };
};

export const getVehicleCategoryById = async (id: string) => {
  return VehicleCategory.findById(id);
};

export const updateVehicleCategory = async (id: string, updates: Partial<IVehicleCategory>) => {
  return VehicleCategory.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

export const deleteVehicleCategory = async (id: string) => {
  return VehicleCategory.findByIdAndDelete(id);
};
