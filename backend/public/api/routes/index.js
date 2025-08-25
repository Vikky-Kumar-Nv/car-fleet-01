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
exports.apiRouter = void 0;
const express_1 = require("express");
const auth_route_1 = require("./auth.route");
const booking_route_1 = require("./booking.route");
const company_route_1 = require("./company.route");
const city_route_1 = require("./city.route");
const vehicles_route_1 = require("./vehicles.route");
const users_route_1 = require("./users.route");
const financial_route_1 = require("./financial.route");
const operations_route_1 = require("./operations.route");
const middleware_1 = require("../middleware");
const driverReportController = __importStar(require("../controller/driverReport.controller"));
const router = (0, express_1.Router)();
exports.apiRouter = router;
router.use('/auth', auth_route_1.authRouter);
router.use('/bookings', middleware_1.apiLimiter, booking_route_1.bookingRouter);
router.use('/companies', middleware_1.apiLimiter, company_route_1.companyRouter);
router.use('/cities', city_route_1.cityRouter);
// Consolidated routes - preserving original endpoint URLs
router.use('/vehicles', middleware_1.apiLimiter, vehicles_route_1.vehiclesRouter);
// Mount consolidated routers to preserve original endpoint URLs
// All mounted at root to handle their respective endpoint patterns
router.use('/', middleware_1.apiLimiter, users_route_1.usersRouter); // handles /customers/*, /drivers/*
router.use('/', middleware_1.apiLimiter, financial_route_1.financialRouter); // handles /payments/*, /metrics/*, /drivers/:id/payments/*
router.use('/', middleware_1.apiLimiter, operations_route_1.operationsRouter); // handles /reports/*, /fuel/*
// Add missing /finance/* endpoints that were lost in consolidation
// These delegate to the appropriate handlers in the financial router
const financeController = __importStar(require("../controller/finance.controller"));
router.get('/finance/metrics', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant']), financeController.getFinanceMetrics);
router.get('/finance/drivers/:id/payments', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'accountant']), financeController.getDriverPayments);
// aggregated driver reports month listing
router.get('/driver-reports', middleware_1.apiLimiter, (0, middleware_1.auth)(['admin', 'dispatcher', 'accountant']), driverReportController.listAllDriverMonthReports);
