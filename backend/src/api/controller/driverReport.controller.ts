import { Request, Response } from 'express';
import * as service from '../services';

export const listDriverMonthReports = async (req: Request, res: Response) => {
  const { driverId } = req.params;
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);
  if (isNaN(year) || isNaN(month)) return res.status(400).json({ message: 'year and month required' });
  const docs = await service.listDriverReportsForMonth(driverId, year, month);
  res.json(docs);
};

export const listAllDriverMonthReports = async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string, 10);
  const month = parseInt(req.query.month as string, 10);
  if (isNaN(year) || isNaN(month)) return res.status(400).json({ message: 'year and month required' });
  const docs = await service.listAllDriversReportsForMonth(year, month);
  res.json(docs);
};

export const upsertDriverReport = async (req: Request, res: Response) => {
  const { driverId } = req.params;
  const { date, ...rest } = req.body;
  if (!date) return res.status(400).json({ message: 'date required' });
  const entryDate = new Date(date);
  const doc = await service.upsertDriverReportEntry(driverId, entryDate, rest);
  res.status(200).json(doc);
};
