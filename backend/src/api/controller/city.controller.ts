import { Request, Response } from 'express';
import * as service from '../services/city.service';

export const list = async (_req: Request, res: Response) => {
  const cities = await service.listCities();
  res.json(cities.map(c => ({ id: (c as any)._id?.toString?.() || (c as any).id || '', name: c.name, createdAt: c.createdAt })));
};

export const create = async (req: Request, res: Response) => {
  const name = (req.body?.name || '').toString().trim();
  if (!name) return res.status(400).json({ message: 'Name is required' });
  const city = await service.createCity(name);
  res.status(201).json({ id: (city as any)._id?.toString?.() || (city as any).id || '', name: city.name, createdAt: city.createdAt });
};

export const remove = async (req: Request, res: Response) => {
  await service.deleteCity(req.params.id);
  res.status(204).send();
};
