// src/api/services/customer.service.ts
import { Customer } from '../models';
import { ICustomer } from '../types';
import { Types } from 'mongoose';

interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  companyId?: string; // string form received from API
}

export const createCustomer = async (data: CreateCustomerInput) => {
  const customer = new Customer({
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    companyId: data.companyId ? new Types.ObjectId(data.companyId) : undefined,
  });
  await customer.save();
  return customer;
};

export const getCustomers = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [customers, total] = await Promise.all([
    Customer.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Customer.countDocuments(),
  ]);
  return { customers, total };
};

export const getCustomerById = async (id: string) => Customer.findById(id);

export const updateCustomer = async (id: string, updates: Partial<ICustomer> & { companyId?: string }) => {
  const mapped: any = { ...updates };
  if (mapped.companyId && typeof mapped.companyId === 'string') {
    mapped.companyId = new Types.ObjectId(mapped.companyId);
  }
  return Customer.findByIdAndUpdate(id, mapped, { new: true });
};

export const deleteCustomer = async (id: string) => Customer.findByIdAndDelete(id);
