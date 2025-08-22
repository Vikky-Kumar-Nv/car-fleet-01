// src/api/controller/fuel.controller.ts
import { Request, Response } from 'express';
import * as service from '../services';
import { fuelEntrySchema } from '../validation';
import { updateFuelEntry } from '../services/fuel.service';

export const createFuel = async (req: Request, res: Response) => {
  try {
    const parsed = fuelEntrySchema.parse(req.body);
    const doc = await service.createFuelEntry({
      ...parsed,
      fuelFillDate: new Date(parsed.fuelFillDate),
      includeInFinance: parsed.includeInFinance ?? true,
    });
    res.status(201).json(doc);
  } catch (e: any) {
    if (e.name === 'ZodError') return res.status(400).json({ message: 'Invalid payload', errors: e.errors });
    res.status(500).json({ message: e.message });
  }
};

export const listFuel = async (req: Request, res: Response) => {
  const { vehicleId, bookingId } = req.query;
  const docs = await service.listFuelEntries(vehicleId as string, bookingId as string);
  res.json(docs);
};

export const getFuel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const doc = await service.getFuelEntry(id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json(doc);
};

export const deleteFuel = async (req: Request, res: Response) => {
  const { id } = req.params;
  await service.deleteFuelEntry(id);
  res.status(204).end();
};

export const updateFuel = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updates: any = { ...req.body };
    if (updates.fuelFillDate) updates.fuelFillDate = new Date(updates.fuelFillDate);
    const doc = await updateFuelEntry(id, updates);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
