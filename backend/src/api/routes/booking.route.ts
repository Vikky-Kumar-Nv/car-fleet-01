// src/routes/booking.route.ts (Updated)
import { Router } from 'express';
import * as controller from '../controller/booking.controller';
import { auth } from '../middleware';
import { UserRole } from '../types';

const router = Router();

router.post('/', auth(['admin', 'dispatcher']), controller.createBooking);
router.get('/', auth(['admin', 'dispatcher', 'driver', 'customer']), controller.getBookings); // Customer can read
router.get('/:id', auth(['admin', 'dispatcher', 'driver', 'customer']), controller.getBookingById);
router.put('/:id', auth(['admin', 'dispatcher']), controller.updateBooking); // No driver mutation
router.delete('/:id', auth(['admin', 'dispatcher']), controller.deleteBooking);
router.post('/:id/expenses', auth(['admin', 'dispatcher']), controller.addExpense);
router.put('/:id/status', auth(['admin', 'dispatcher', 'driver']), controller.updateStatus); // Driver can update status
router.post('/:id/duty-slips', auth(['admin', 'dispatcher']), controller.uploadDutySlips);
router.put('/:id/remove-duty-slip', auth(['admin', 'dispatcher']), controller.removeDutySlip);

export { router as bookingRouter };