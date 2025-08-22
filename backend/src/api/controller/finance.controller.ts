import { Request, Response } from 'express';
import * as service from '../services';

export const getFinanceMetrics = async (req: Request, res: Response) => {
  const metrics = await service.getFinanceMetrics();
  res.json(metrics);
};

export const getDriverPayments = async (req: Request, res: Response) => {
  const payments = await service.getPaymentsByDriver(req.params.id);
  res.json(payments);
};