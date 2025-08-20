import { Router } from 'express';
import * as controller from '../controller/report.controller';
import { auth } from '../middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/monthly-earnings', auth(['admin', 'accountant']), controller.getMonthlyEarnings);
router.get('/driver-performance', auth(['admin', 'accountant']), controller.getDriverPerformance);
router.get('/vehicle-usage', auth(['admin', 'accountant']), controller.getVehicleUsage);
router.get('/expense-breakdown', auth(['admin', 'accountant']), controller.getExpenseBreakdown);

export { router as reportRouter };