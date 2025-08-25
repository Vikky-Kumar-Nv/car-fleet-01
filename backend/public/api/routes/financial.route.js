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
exports.financialRouter = void 0;
// src/routes/financial.route.ts
const express_1 = require("express");
const paymentController = __importStar(require("../controller/payment.controller"));
const financeController = __importStar(require("../controller/finance.controller"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
exports.financialRouter = router;
// Create sub-routers for logical organization
const paymentsRouter = (0, express_1.Router)();
const metricsRouter = (0, express_1.Router)();
const driverPaymentsRouter = (0, express_1.Router)();
// Payment operations - mounted at /financial/payments/*
paymentsRouter.post('/', (0, middleware_1.auth)(['admin', 'accountant']), paymentController.createPayment);
paymentsRouter.get('/', (0, middleware_1.auth)(['admin', 'accountant']), paymentController.getPayments);
// Financial metrics - mounted at /financial/metrics/*
metricsRouter.get('/', (0, middleware_1.auth)(['admin', 'accountant']), financeController.getFinanceMetrics);
// Driver payments - mounted at /financial/drivers/:id/payments/*
driverPaymentsRouter.get('/', (0, middleware_1.auth)(['admin', 'accountant']), financeController.getDriverPayments);
// Mount sub-routers
router.use('/payments', paymentsRouter);
router.use('/metrics', metricsRouter);
router.use('/drivers/:id/payments', driverPaymentsRouter);
