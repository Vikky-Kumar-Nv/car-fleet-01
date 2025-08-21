// src/api/services/customer.service.ts
import { Customer } from '../models';
import { ICustomer } from '../types';

export const createCustomer = async (data: Omit<ICustomer, '_id' | 'createdAt'>) => {
  const customer = new Customer(data);
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

export const updateCustomer = async (id: string, updates: Partial<ICustomer>) => Customer.findByIdAndUpdate(id, updates, { new: true });

export const deleteCustomer = async (id: string) => Customer.findByIdAndDelete(id);
