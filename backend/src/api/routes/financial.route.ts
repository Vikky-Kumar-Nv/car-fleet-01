// src/routes/financial.route.ts
import { Router } from 'express';
import * as paymentController from '../controller/payment.controller';
import * as financeController from '../controller/finance.controller';
import { auth } from '../middleware';
import { UserRole } from '../types';

const router = Router();

// Create sub-routers for logical organization
const paymentsRouter = Router();
const metricsRouter = Router();
const driverPaymentsRouter = Router();

// Payment operations - mounted at /financial/payments/*
paymentsRouter.post('/', auth(['admin', 'accountant']), paymentController.createPayment);
paymentsRouter.get('/', auth(['admin', 'accountant']), paymentController.getPayments);

// Financial metrics - mounted at /financial/metrics/*
metricsRouter.get('/', auth(['admin', 'accountant']), financeController.getFinanceMetrics);

// Driver payments - mounted at /financial/drivers/:id/payments/*
driverPaymentsRouter.get('/', auth(['admin', 'accountant']), financeController.getDriverPayments);

// Mount sub-routers
router.use('/payments', paymentsRouter);
router.use('/metrics', metricsRouter);
router.use('/drivers/:id/payments', driverPaymentsRouter);

export { router as financialRouter };