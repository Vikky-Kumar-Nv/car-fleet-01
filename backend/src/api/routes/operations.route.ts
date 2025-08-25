import { Router } from 'express';
import { auth, apiLimiter } from '../middleware';
import * as reportController from '../controller/report.controller';
import * as fuelController from '../controller/fuel.controller';

const router = Router();

// Reports sub-router - /operations/reports/*
const reportsRouter = Router();
reportsRouter.get('/monthly-earnings', auth(['admin', 'accountant']), reportController.getMonthlyEarnings);
reportsRouter.get('/driver-performance', auth(['admin', 'accountant']), reportController.getDriverPerformance);
reportsRouter.get('/vehicle-usage', auth(['admin', 'accountant']), reportController.getVehicleUsage);
reportsRouter.get('/expense-breakdown', auth(['admin', 'accountant']), reportController.getExpenseBreakdown);

// Fuel sub-router - /operations/fuel/*
const fuelRouter = Router();
fuelRouter.post('/', apiLimiter, auth(['admin','accountant','dispatcher']), fuelController.createFuel);
fuelRouter.get('/', apiLimiter, auth(['admin','accountant','dispatcher']), fuelController.listFuel);
fuelRouter.get('/:id', apiLimiter, auth(['admin','accountant','dispatcher']), fuelController.getFuel);
fuelRouter.put('/:id', apiLimiter, auth(['admin','accountant','dispatcher']), fuelController.updateFuel);
fuelRouter.delete('/:id', apiLimiter, auth(['admin','accountant','dispatcher']), fuelController.deleteFuel);

// Mount sub-routers
router.use('/reports', reportsRouter);
router.use('/fuel', fuelRouter);

export { router as operationsRouter };