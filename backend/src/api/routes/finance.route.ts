import { Router } from 'express';
import * as controller from '../controller/finance.controller';
import { auth } from '../middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/metrics', auth(['admin', 'accountant']), controller.getFinanceMetrics);
router.get('/drivers/:id/payments', auth(['admin', 'accountant']), controller.getDriverPayments);

export { router as financeRouter };