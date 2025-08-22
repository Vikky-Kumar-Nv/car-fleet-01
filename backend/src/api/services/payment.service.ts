// src/services/payment.service.ts
import { Payment, Company, Driver } from '../models';
import { IPayment } from '../types';

export const createPayment = async (data: Omit<IPayment, '_id'>) => {
  const payment = new Payment(data);
  await payment.save();
  if (data.entityType === 'customer' && data.type === 'received') {
    await Company.updateOne({ _id: data.entityId }, { $inc: { outstandingAmount: -data.amount } });
  } else if (data.entityType === 'driver' && data.type === 'paid' && data.relatedAdvanceId) {
    await Driver.updateOne(
      { _id: data.entityId, 'advances.id': data.relatedAdvanceId },
      { $set: { 'advances.$.settled': true } }
    );
  }
  return payment;
};

export const getPayments = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [payments, total] = await Promise.all([
    Payment.find().skip(skip).limit(limit).sort({ date: -1 }),
    Payment.countDocuments(),
  ]);
  return { payments, total };
};