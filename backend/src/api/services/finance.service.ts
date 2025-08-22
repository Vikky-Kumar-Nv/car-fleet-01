import { Booking, Payment, Company, Driver } from '../models';

export const getFinanceMetrics = async () => {
  const [totalRevenue, totalOutstanding, totalExpenses, netProfit] = await Promise.all([
    Booking.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Company.aggregate([{ $group: { _id: null, total: { $sum: '$outstandingAmount' } } }]),
    Booking.aggregate([{ $unwind: '$expenses' }, { $group: { _id: null, total: { $sum: '$expenses.amount' } } }]),
    Booking.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, expenses: { $sum: '$expenses.amount' } } },
      { $project: { netProfit: { $subtract: ['$revenue', '$expenses'] } } },
    ]),
  ]);
  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    totalOutstanding: totalOutstanding[0]?.total || 0,
    totalExpenses: totalExpenses[0]?.total || 0,
    netProfit: netProfit[0]?.netProfit || 0,
  };
};

export const getPaymentsByDriver = async (driverId: string) => {
  return Payment.find({ entityId: driverId, entityType: 'driver' }).sort({ date: -1 });
};