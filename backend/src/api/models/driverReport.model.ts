import { Schema, model } from 'mongoose';
import { IDriverReportEntry } from '../types';

const driverReportSchema = new Schema<IDriverReportEntry>({
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true, index: true },
  date: { type: Date, required: true, index: true },
  totalKm: { type: Number },
  daysWorked: { type: Number },
  nightsWorked: { type: Number },
  nightAmount: { type: Number },
  salaryRate: { type: Number },
  totalAmount: { type: Number },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

driverReportSchema.index({ driverId: 1, date: 1 }, { unique: true });

driverReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const DriverReport = model<IDriverReportEntry>('DriverReport', driverReportSchema);
