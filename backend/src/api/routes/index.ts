import { Router } from 'express';
import { authRouter } from './auth.route';
import { bookingRouter } from './booking.route';
import { companyRouter } from './company.route';
import { cityRouter } from './city.route';
import { vehiclesRouter } from './vehicles.route';
import { usersRouter } from './users.route';
import { financialRouter } from './financial.route';
import { operationsRouter } from './operations.route';
import { apiLimiter, auth } from '../middleware';
import * as driverReportController from '../controller/driverReport.controller';

const router = Router();

router.use('/auth', authRouter);
router.use('/bookings', apiLimiter, bookingRouter);
router.use('/companies', apiLimiter, companyRouter);
router.use('/cities', cityRouter);

// Consolidated routes - preserving original endpoint URLs
router.use('/vehicles', apiLimiter, vehiclesRouter);

// Mount consolidated routers to preserve original endpoint URLs
// All mounted at root to handle their respective endpoint patterns
router.use('/', apiLimiter, usersRouter);      // handles /customers/*, /drivers/*
router.use('/', apiLimiter, financialRouter);  // handles /payments/*, /metrics/*, /drivers/:id/payments/*
router.use('/', apiLimiter, operationsRouter); // handles /reports/*, /fuel/*

// Add missing /finance/* endpoints that were lost in consolidation
// These delegate to the appropriate handlers in the financial router
import * as financeController from '../controller/finance.controller';
router.get('/finance/metrics', apiLimiter, auth(['admin', 'accountant']), financeController.getFinanceMetrics);
router.get('/finance/drivers/:id/payments', apiLimiter, auth(['admin', 'accountant']), financeController.getDriverPayments);

// aggregated driver reports month listing
router.get('/driver-reports', apiLimiter, auth(['admin','dispatcher','accountant']), driverReportController.listAllDriverMonthReports);

export { router as apiRouter };