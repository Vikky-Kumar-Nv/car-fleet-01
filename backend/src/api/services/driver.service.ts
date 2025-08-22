// src/services/driver.service.ts
import { Driver } from '../models';
import { IDriver } from '../types';

export const createDriver = async (data: Omit<IDriver, '_id' | 'createdAt' | 'advances'>) => {
  const driver = new Driver({
    ...data,
    advances: [],
  });
  await driver.save();
  return driver;
};

export const getDrivers = async (page: number, limit: number, filters: any) => {
  const query: Record<string, any> = {};
  if (filters.status) query['status'] = filters.status;
  if (filters.paymentMode) query['paymentMode'] = filters.paymentMode;
  const skip = (page - 1) * limit;
  const [drivers, total] = await Promise.all([
    Driver.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Driver.countDocuments(query),
  ]);
  return { drivers, total };
};

export const getDriverById = async (id: string) => {
  return Driver.findById(id);
};

export const updateDriver = async (id: string, updates: Partial<IDriver>) => {
  return Driver.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

export const deleteDriver = async (id: string) => {
  return Driver.findByIdAndDelete(id);
};

export const addAdvance = async (driverId: string, advance: IDriver['advances'][0]) => {
  return Driver.findByIdAndUpdate(driverId, { $push: { advances: { ...advance, date: new Date() } } }, { new: true });
};

export const settleAdvance = async (driverId: string, advanceId: string) => {
  return Driver.updateOne(
    { _id: driverId, 'advances.id': advanceId },
    { $set: { 'advances.$.settled': true } }
  );
};