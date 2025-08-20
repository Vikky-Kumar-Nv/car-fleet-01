import { Router } from 'express';
import { authRouter } from './auth.route';
import { bookingRouter } from './booking.route';
import { driverRouter } from './driver.route';
import { vehicleRouter } from './vehicle.route';
import { companyRouter } from './company.route';
import { paymentRouter } from './payment.route';
import { reportRouter } from './report.route';
import { financeRouter } from './finance.route';
import { apiLimiter } from '../middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/bookings', apiLimiter, bookingRouter);
router.use('/drivers', apiLimiter, driverRouter);
router.use('/vehicles', apiLimiter, vehicleRouter);
router.use('/companies', apiLimiter, companyRouter);
router.use('/payments', apiLimiter, paymentRouter);
router.use('/reports', apiLimiter, reportRouter);
router.use('/finance', apiLimiter, financeRouter);

export { router as apiRouter };