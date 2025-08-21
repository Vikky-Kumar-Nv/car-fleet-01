// src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import * as service from '../services';
import { vehicleSchema, updateVehicleSchema } from '../validation';

export const createVehicle = async (req: Request, res: Response) => {
  const data = vehicleSchema.parse(req.body);
  const vehicleData: any = {
    ...data,
    // if categoryId provided, allow category to be undefined; else require category (already validated by zod refine)
    insuranceExpiry: new Date(data.insuranceExpiry),
    fitnessExpiry: new Date(data.fitnessExpiry),
    permitExpiry: new Date(data.permitExpiry),
    pollutionExpiry: new Date(data.pollutionExpiry),
    status: 'active' as const,
  };
  const vehicle = await service.createVehicle(vehicleData);
  res.status(201).json(vehicle);
};

export const getVehicles = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filters = { status: req.query.status, owner: req.query.owner, category: req.query.category };
  const result = await service.getVehicles(page, limit, filters);
  res.json(result);
};

export const getVehicleById = async (req: Request, res: Response) => {
  const vehicle = await service.getVehicleById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  res.json(vehicle);
};

export const updateVehicle = async (req: Request, res: Response) => {
  const data = updateVehicleSchema.parse(req.body);
  const updateData: any = { ...data };
  
  // Convert date strings to Date objects
  if (updateData.insuranceExpiry) updateData.insuranceExpiry = new Date(updateData.insuranceExpiry);
  if (updateData.fitnessExpiry) updateData.fitnessExpiry = new Date(updateData.fitnessExpiry);
  if (updateData.permitExpiry) updateData.permitExpiry = new Date(updateData.permitExpiry);
  if (updateData.pollutionExpiry) updateData.pollutionExpiry = new Date(updateData.pollutionExpiry);
  
  const vehicle = await service.updateVehicle(req.params.id, updateData);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  res.json(vehicle);
};

export const deleteVehicle = async (req: Request, res: Response) => {
  await service.deleteVehicle(req.params.id);
  res.status(204).send();
};