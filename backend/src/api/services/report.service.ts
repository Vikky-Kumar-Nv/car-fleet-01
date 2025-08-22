// src/services/report.service.ts
import { Booking } from '../models';

export const getMonthlyEarnings = async (start: Date, end: Date) => {
  const aggregate = await Booking.aggregate([
    { $match: { startDate: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$startDate' } },
        earnings: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return aggregate.map(({ _id, earnings }) => ({ month: _id, earnings }));
};

export const getDriverPerformance = async (start: Date, end: Date) => {
  const aggregate = await Booking.aggregate([
    { $match: { startDate: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$driverId',
        trips: { $sum: 1 },
        earnings: { $sum: '$totalAmount' },
      },
    },
    { $lookup: { from: 'drivers', localField: '_id', foreignField: '_id', as: 'driver' } },
    { $unwind: '$driver' },
    { $project: { driver: '$driver.name', trips: 1, earnings: 1 } },
  ]);
  return aggregate;
};

// Similar for vehicle usage and expense breakdown
// ...


export const getVehicleUsage = async (start: Date, end: Date) => {
  return Booking.aggregate([
    { $match: { startDate: { $gte: start, $lte: end }, vehicleId: { $ne: null } } },
    { $group: { _id: '$vehicleId', trips: { $sum: 1 }, totalDistance: { $sum: 100 } } }, // Placeholder for distance
    { $lookup: { from: 'vehicles', localField: '_id', foreignField: '_id', as: 'vehicle' } },
    { $unwind: '$vehicle' },
    { $project: { vehicle: '$vehicle.registrationNumber', trips: 1, totalDistance: 1 } },
  ]);
};

export const getExpenseBreakdown = async (start: Date, end: Date) => {
  return Booking.aggregate([
    { $match: { startDate: { $gte: start, $lte: end } } },
    { $unwind: '$expenses' },
    {
      $group: {
        _id: '$expenses.type',
        total: { $sum: '$expenses.amount' },
      },
    },
  ]);
};