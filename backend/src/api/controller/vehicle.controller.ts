// src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import * as service from '../services';
import { vehicleSchema, updateVehicleSchema } from '../validation';
import { upload } from '../middleware';
import { uploadToCloudinary } from '../../config/cloudinary';

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
  // Upload files to Cloudinary if present
  const files = (req as any).files as Record<string, Express.Multer.File[]> | undefined;
  if (files) {
    const assign = async (field: string, targetField: string) => {
      const fArr = files[field];
      if (fArr && fArr[0]) {
        const uploaded = await uploadToCloudinary(fArr[0].path, 'vehicles');
        (vehicleData as any)[targetField] = uploaded.url; // secure URL
        // If you later store publicId, add: (vehicleData as any)[`${targetField}PublicId`] = uploaded.publicId;
      }
    };
    await assign('photo','photo');
    await assign('document','document');
  }
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
  
  // Upload files to Cloudinary if present
  const files = (req as any).files as Record<string, Express.Multer.File[]> | undefined;
  if (files) {
    const assign = async (field: string, targetField: string) => {
      const fArr = files[field];
      if (fArr && fArr[0]) {
        const uploaded = await uploadToCloudinary(fArr[0].path, 'vehicles');
        (updateData as any)[targetField] = uploaded.url;
        // Optionally persist publicId too
      }
    };
    await assign('photo','photo');
    await assign('document','document');
  }
  const vehicle = await service.updateVehicle(req.params.id, updateData);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  res.json(vehicle);
};

export const deleteVehicle = async (req: Request, res: Response) => {
  await service.deleteVehicle(req.params.id);
  res.status(204).send();
};