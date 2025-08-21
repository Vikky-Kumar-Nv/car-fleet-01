import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as service from '../services';
import { customerSchema, updateCustomerSchema } from '../validation';

export const createCustomer = async (req: Request, res: Response) => {
  const data = customerSchema.parse(req.body);
  const customer = await service.createCustomer(data);
  res.status(201).json(customer);
};

export const getCustomers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const result = await service.getCustomers(page, limit);
  res.json(result);
};

export const getCustomerById = async (req: Request, res: Response) => {
  const customer = await service.getCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

export const updateCustomer = async (req: Request, res: Response) => {
  const data = updateCustomerSchema.parse(req.body);
  const customer = await service.updateCustomer(req.params.id, data);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

export const deleteCustomer = async (req: Request, res: Response) => {
  await service.deleteCustomer(req.params.id);
  res.status(204).send();
};
