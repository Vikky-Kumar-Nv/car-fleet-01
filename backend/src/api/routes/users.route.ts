// src/routes/users.route.ts
import { Router } from 'express';
import * as customerController from '../controller/customer.controller';
import * as driverController from '../controller/driver.controller';
import * as reportController from '../controller/driverReport.controller';
import { auth, upload } from '../middleware';

const router = Router();

// Customer sub-router
const customerRouter = Router();
customerRouter.post('/', customerController.createCustomer);
customerRouter.get('/', customerController.getCustomers);
customerRouter.get('/:id', customerController.getCustomerById);
customerRouter.put('/:id', customerController.updateCustomer);
customerRouter.delete('/:id', customerController.deleteCustomer);

// Driver sub-router
const driverRouter = Router();
driverRouter.post('/', auth(['admin', 'dispatcher']), upload, driverController.createDriver);
driverRouter.get('/', auth(['admin', 'dispatcher']), driverController.getDrivers);
driverRouter.get('/:id', auth(['admin', 'dispatcher']), driverController.getDriverById);
driverRouter.put('/:id', auth(['admin', 'dispatcher']), upload, driverController.updateDriver);
driverRouter.delete('/:id', auth(['admin', 'dispatcher']), driverController.deleteDriver);

// Driver advances endpoints
driverRouter.post('/:id/advances', auth(['admin', 'accountant']), driverController.addAdvance);
driverRouter.put('/:id/settle-advance', auth(['admin', 'accountant']), driverController.settleAdvance);

// Driver reports endpoints
driverRouter.get('/:driverId/reports', auth(['admin','dispatcher','accountant']), reportController.listDriverMonthReports);
driverRouter.put('/:driverId/reports', auth(['admin','dispatcher','accountant']), reportController.upsertDriverReport);

// Mount sub-routers
router.use('/customers', customerRouter);
router.use('/drivers', driverRouter);

export { router as usersRouter };