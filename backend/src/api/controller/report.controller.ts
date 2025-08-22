import { Request, Response } from 'express';
import * as service from '../services';

export const getMonthlyEarnings = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const earnings = await service.getMonthlyEarnings(new Date(start as string), new Date(end as string));
  res.json(earnings);
};

export const getDriverPerformance = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const performance = await service.getDriverPerformance(new Date(start as string), new Date(end as string));
  res.json(performance);
};

export const getVehicleUsage = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const usage = await service.getVehicleUsage(new Date(start as string), new Date(end as string));
  res.json(usage);
};

export const getExpenseBreakdown = async (req: Request, res: Response) => {
  const { start, end } = req.query;
  const breakdown = await service.getExpenseBreakdown(new Date(start as string), new Date(end as string));
  res.json(breakdown);
};