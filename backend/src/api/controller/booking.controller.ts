// src/controllers/booking.controller.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as service from '../services';
import { bookingSchema, updateBookingSchema, expenseSchema, statusSchema, bookingPaymentSchema } from '../validation';

export const createBooking = async (req: Request, res: Response) => {
  const data = bookingSchema.parse(req.body);
  const bookingData = {
    ...data,
  customerId: data.customerId ? new Types.ObjectId(data.customerId) : undefined,
    companyId: data.companyId ? new Types.ObjectId(data.companyId) : undefined,
    vehicleId: data.vehicleId ? new Types.ObjectId(data.vehicleId) : undefined,
    driverId: data.driverId ? new Types.ObjectId(data.driverId) : undefined,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    status: 'booked' as const,
  };
  const booking = await service.createBooking(bookingData);
  res.status(201).json(booking);
};

export const getBookings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const filters = { status: req.query.status, source: req.query.source, startDate: req.query.startDate, endDate: req.query.endDate, driverId: req.query.driverId };
  const result = await service.getBookings(page, limit, filters);
  res.json(result);
};

export const getBookingById = async (req: Request, res: Response) => {
  const booking = await service.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const updateBooking = async (req: Request, res: Response) => {
  const data = updateBookingSchema.parse(req.body);
  const updateData: any = { ...data };
  
  // Convert string IDs to ObjectIds
  if (updateData.companyId) updateData.companyId = new Types.ObjectId(updateData.companyId);
  if (updateData.vehicleId) updateData.vehicleId = new Types.ObjectId(updateData.vehicleId);
  if (updateData.driverId) updateData.driverId = new Types.ObjectId(updateData.driverId);
  if (updateData.customerId) updateData.customerId = new Types.ObjectId(updateData.customerId);
  
  // Convert date strings to Date objects
  if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
  if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
  
  const booking = await service.updateBooking(req.params.id, updateData);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const deleteBooking = async (req: Request, res: Response) => {
  await service.deleteBooking(req.params.id);
  res.status(204).send();
};

export const addExpense = async (req: Request, res: Response) => {
  const data = expenseSchema.parse(req.body);
  const booking = await service.addExpense(req.params.id, data);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const updateStatus = async (req: Request, res: Response) => {
  const { status, changedBy } = statusSchema.parse(req.body);
  const booking = await service.updateStatus(req.params.id, status, changedBy || 'System');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const uploadDutySlips = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] || [];
  const uploadedBy = req.body.uploadedBy || 'System'; // Get from request body or use default
  const booking = await service.uploadDutySlips(req.params.id, files, uploadedBy);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const removeDutySlip = async (req: Request, res: Response) => {
  const { path } = req.body;
  const booking = await service.removeDutySlip(req.params.id, path);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const addPayment = async (req: Request, res: Response) => {
  const data = bookingPaymentSchema.parse(req.body);
  const payment = { ...data, paidOn: new Date(data.paidOn) };
  const booking = await service.addPayment(req.params.id, payment as any);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

export const getPayments = async (req: Request, res: Response) => {
  const payments = await service.listPayments(req.params.id);
  res.json(payments);
};