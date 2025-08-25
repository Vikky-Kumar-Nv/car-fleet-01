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
exports.operationsRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const reportController = __importStar(require("../controller/report.controller"));
const fuelController = __importStar(require("../controller/fuel.controller"));
const router = (0, express_1.Router)();
exports.operationsRouter = router;
// Reports sub-router - /operations/reports/*
const reportsRouter = (0, express_1.Router)();
reportsRouter.get('/monthly-earnings', (0, middleware_1.auth)(['admin', 'accountant']), reportController.getMonthlyEarnings);
reportsRouter.get('/driver-performance', (0, middleware_1.auth)(['admin', 'accountant']), reportController.getDriverPerformance);
reportsRouter.get('/vehicle-usage', (0, middleware_1.auth)(['admin', 'accountant']), reportController.getVehicleUsage);
reportsRouter.get('/expense-breakdown', (0, middleware_1.auth)(['admin', 'accountant']), reportController.getExpenseBreakdown);
// Fuel sub-router - /operations/fuel/*
const fuelRouter = (0, express_1.Router)();
fuelRouter.post('/', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant', 'dispatcher']), fuelController.createFuel);
fuelRouter.get('/', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant', 'dispatcher']), fuelController.listFuel);
fuelRouter.get('/:id', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant', 'dispatcher']), fuelController.getFuel);
fuelRouter.put('/:id', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant', 'dispatcher']), fuelController.updateFuel);
fuelRouter.delete('/:id', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant', 'dispatcher']), fuelController.deleteFuel);
// Mount sub-routers
router.use('/reports', reportsRouter);
router.use('/fuel', fuelRouter);
