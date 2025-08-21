import { DriverReport } from '../models';
import { IDriverReportEntry } from '../types';

export const upsertDriverReportEntry = async (driverId: string, date: Date, data: Partial<IDriverReportEntry>) => {
  const normalized = new Date(date);
  normalized.setHours(0,0,0,0);
  const update: any = { ...data, driverId, date: normalized };
  delete update._id;
  const doc = await DriverReport.findOneAndUpdate(
    { driverId, date: normalized },
    { $set: update },
    { new: true, upsert: true }
  );
  return doc;
};

export const getDriverReportEntry = (driverId: string, date: Date) => {
  const normalized = new Date(date); normalized.setHours(0,0,0,0);
  return DriverReport.findOne({ driverId, date: normalized });
};

const monthRange = (year: number, month: number) => {
  const start = new Date(year, month, 1); start.setHours(0,0,0,0);
  const end = new Date(year, month + 1, 0); end.setHours(23,59,59,999);
  return { start, end };
};

export const listDriverReportsForMonth = (driverId: string, year: number, month: number) => {
  const { start, end } = monthRange(year, month);
  return DriverReport.find({ driverId, date: { $gte: start, $lte: end } }).sort({ date: 1 });
};

export const listAllDriversReportsForMonth = (year: number, month: number) => {
  const { start, end } = monthRange(year, month);
  return DriverReport.find({ date: { $gte: start, $lte: end } });
};
