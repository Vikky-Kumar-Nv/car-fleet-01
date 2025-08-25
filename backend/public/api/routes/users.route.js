"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
// src/routes/users.route.ts
const express_1 = require("express");
const customerController = __importStar(require("../controller/customer.controller"));
const driverController = __importStar(require("../controller/driver.controller"));
const reportController = __importStar(require("../controller/driverReport.controller"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
exports.usersRouter = router;
// Customer sub-router
const customerRouter = (0, express_1.Router)();
customerRouter.post('/', customerController.createCustomer);
customerRouter.get('/', customerController.getCustomers);
customerRouter.get('/:id', customerController.getCustomerById);
customerRouter.put('/:id', customerController.updateCustomer);
customerRouter.delete('/:id', customerController.deleteCustomer);
// Driver sub-router
const driverRouter = (0, express_1.Router)();
driverRouter.post('/', (0, middleware_1.auth)(['admin', 'dispatcher']), middleware_1.upload, driverController.createDriver);
driverRouter.get('/', (0, middleware_1.auth)(['admin', 'dispatcher']), driverController.getDrivers);
driverRouter.get('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), driverController.getDriverById);
driverRouter.put('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), middleware_1.upload, driverController.updateDriver);
driverRouter.delete('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), driverController.deleteDriver);
// Driver advances endpoints
driverRouter.post('/:id/advances', (0, middleware_1.auth)(['admin', 'accountant']), driverController.addAdvance);
driverRouter.put('/:id/settle-advance', (0, middleware_1.auth)(['admin', 'accountant']), driverController.settleAdvance);
// Driver reports endpoints
driverRouter.get('/:driverId/reports', (0, middleware_1.auth)(['admin', 'dispatcher', 'accountant']), reportController.listDriverMonthReports);
driverRouter.put('/:driverId/reports', (0, middleware_1.auth)(['admin', 'dispatcher', 'accountant']), reportController.upsertDriverReport);
// Mount sub-routers
router.use('/customers', customerRouter);
router.use('/drivers', driverRouter);
