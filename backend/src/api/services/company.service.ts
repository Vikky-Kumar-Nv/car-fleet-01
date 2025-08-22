// src/services/company.service.ts
import { Company } from '../models';
import { ICompany } from '../types';

export const createCompany = async (data: Omit<ICompany, '_id' | 'createdAt' | 'outstandingAmount'>) => {
  const company = new Company({
    ...data,
    outstandingAmount: 0,
  });
  await company.save();
  return company;
};

export const getCompanies = async (page: number, limit: number, filters: any) => {
  const query: Record<string, any> = {};
  if (filters.outstandingGt) query['outstandingAmount'] = { $gt: Number(filters.outstandingGt) };
  if (filters.minOutstanding) query['outstandingAmount'] = { $gte: Number(filters.minOutstanding) };
  if (filters.startDate) query['createdAt'] = { $gte: new Date(filters.startDate) };
  if (filters.endDate) query['createdAt'] = { $lte: new Date(filters.endDate) };
  const skip = (page - 1) * limit;
  const [companies, total] = await Promise.all([
    Company.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Company.countDocuments(query),
  ]);
  return { companies, total };
};

export const getCompanyById = async (id: string) => {
  return Company.findById(id);
};

export const updateCompany = async (id: string, updates: Partial<ICompany>) => {
  return Company.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

export const deleteCompany = async (id: string) => {
  return Company.findByIdAndDelete(id);
};

export const recordPayment = async (companyId: string, amount: number, description: string) => {
  await Company.updateOne({ _id: companyId }, { $inc: { outstandingAmount: -amount } });
  // add to payments via payment.service
};