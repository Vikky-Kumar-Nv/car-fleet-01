// src/controllers/driver.controller.ts
import { Request, Response } from 'express';
import * as service from '../services';
import { driverSchema, updateDriverSchema, advanceSchema } from '../validation';
import { upload } from '../middleware';
import { uploadToCloudinary } from '../../config/cloudinary';

export const createDriver = async (req: Request, res: Response) => {
  // If multipart form-data used, multer (upload middleware) should have run before this controller.
  const data = driverSchema.parse(req.body);
  const driverData: any = {
    ...data,
    licenseExpiry: new Date(data.licenseExpiry),
    policeVerificationExpiry: new Date(data.policeVerificationExpiry),
    dateOfJoining: new Date(data.dateOfJoining),
    status: data.status || 'active',
  };
  // Handle uploaded files if present
  // Expect fields: photo (single), document (single), licenseDocument, policeVerificationDocument
  // When using multer.array('files'), files do not have fieldname mapping unless custom. For simplicity we also allow direct string paths from body.
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  if (files) {
    const assign = async (field: string, targetField: string) => {
      const fArr = files[field];
      if (fArr && fArr[0]) {
        const uploaded = await uploadToCloudinary(fArr[0].path, 'drivers');
        (driverData as any)[targetField] = uploaded.url;
        (driverData as any)[`${targetField}PublicId`] = uploaded.publicId;
      }
    };
    await assign('photo','photo');
    await assign('licenseDocument','licenseDocument');
    await assign('policeVerificationDocument','policeVerificationDocument');
    await assign('document','document');
  }
  const driver = await service.createDriver(driverData);
  res.status(201).json(driver);
};

export const getDrivers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filters = { status: req.query.status, paymentMode: req.query.paymentMode };
  const result = await service.getDrivers(page, limit, filters);
  res.json(result);
};

export const getDriverById = async (req: Request, res: Response) => {
  const driver = await service.getDriverById(req.params.id);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });
  res.json(driver);
};

export const updateDriver = async (req: Request, res: Response) => {
  const data = updateDriverSchema.parse(req.body);
  const updateData: any = { ...data };
  
  // Convert date strings to Date objects
  if (updateData.licenseExpiry) updateData.licenseExpiry = new Date(updateData.licenseExpiry);
  if (updateData.policeVerificationExpiry) updateData.policeVerificationExpiry = new Date(updateData.policeVerificationExpiry);
  if (updateData.dateOfJoining) updateData.dateOfJoining = new Date(updateData.dateOfJoining as any);
  const ufiles = req.files as Record<string, Express.Multer.File[]> | undefined;
  if (ufiles) {
    const assign = async (field: string, targetField: string) => {
      const fArr = ufiles[field];
      if (fArr && fArr[0]) {
        const uploaded = await uploadToCloudinary(fArr[0].path, 'drivers');
        (updateData as any)[targetField] = uploaded.url;
        (updateData as any)[`${targetField}PublicId`] = uploaded.publicId;
      }
    };
    await assign('photo','photo');
    await assign('licenseDocument','licenseDocument');
    await assign('policeVerificationDocument','policeVerificationDocument');
    await assign('document','document');
  }
  
  const driver = await service.updateDriver(req.params.id, updateData);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });
  res.json(driver);
};

export const deleteDriver = async (req: Request, res: Response) => {
  await service.deleteDriver(req.params.id);
  res.status(204).send();
};

export const addAdvance = async (req: Request, res: Response) => {
  const data = advanceSchema.parse(req.body);
  const advanceData = {
    ...data,
    date: new Date(),
    settled: false,
    description: data.description || '', // Ensure description is always a string
  };
  const driver = await service.addAdvance(req.params.id, advanceData);
  if (!driver) return res.status(404).json({ message: 'Driver not found' });
  res.json(driver);
};

export const settleAdvance = async (req: Request, res: Response) => {
  const { advanceId } = req.body;
  await service.settleAdvance(req.params.id, advanceId);
  res.status(200).json({ message: 'Advance settled' });
};