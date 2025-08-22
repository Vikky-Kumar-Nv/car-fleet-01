// src/controllers/vehicleCategory.controller.ts
import { Request, Response } from 'express';
import * as service from '../services';
import { vehicleCategorySchema, updateVehicleCategorySchema } from '../validation';

export const createVehicleCategory = async (req: Request, res: Response) => {
  const data = vehicleCategorySchema.parse(req.body);
  const category = await service.createVehicleCategory(data as any);
  res.status(201).json(category);
};

export const getVehicleCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const result = await service.getVehicleCategories(page, limit);
  res.json(result);
};

export const getVehicleCategoryById = async (req: Request, res: Response) => {
  const category = await service.getVehicleCategoryById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Vehicle category not found' });
  res.json(category);
};

export const updateVehicleCategory = async (req: Request, res: Response) => {
  const data = updateVehicleCategorySchema.parse(req.body);
  const category = await service.updateVehicleCategory(req.params.id, data as any);
  if (!category) return res.status(404).json({ message: 'Vehicle category not found' });
  res.json(category);
};

export const deleteVehicleCategory = async (req: Request, res: Response) => {
  await service.deleteVehicleCategory(req.params.id);
  res.status(204).send();
};
