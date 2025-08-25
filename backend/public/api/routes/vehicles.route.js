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
exports.vehiclesRouter = void 0;
// src/routes/vehicles.route.ts
const express_1 = require("express");
const vehicleController = __importStar(require("../controller/vehicle.controller"));
const vehicleCategoryController = __importStar(require("../controller/vehicleCategory.controller"));
const vehicleServicingController = __importStar(require("../controller/vehicleServicing.controller"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
exports.vehiclesRouter = router;
// Main vehicle routes - /vehicles/*
router.post('/', (0, middleware_1.auth)(['admin', 'dispatcher']), middleware_1.upload, vehicleController.createVehicle);
router.get('/', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleController.getVehicles);
router.get('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleController.getVehicleById);
router.put('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), middleware_1.upload, vehicleController.updateVehicle);
router.delete('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleController.deleteVehicle);
// Vehicle category routes - /vehicles/categories/*
const categoryRouter = (0, express_1.Router)();
categoryRouter.post('/', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleCategoryController.createVehicleCategory);
categoryRouter.get('/', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleCategoryController.getVehicleCategories);
categoryRouter.get('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleCategoryController.getVehicleCategoryById);
categoryRouter.put('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleCategoryController.updateVehicleCategory);
categoryRouter.delete('/:id', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleCategoryController.deleteVehicleCategory);
// Mount category sub-router
router.use('/categories', categoryRouter);
// Vehicle servicing routes - /vehicles/:vehicleId/servicing/*
const servicingRouter = (0, express_1.Router)({ mergeParams: true });
servicingRouter.get('/:vehicleId/servicing', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleServicingController.getServicing);
servicingRouter.put('/:vehicleId/servicing', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleServicingController.upsertServicing);
servicingRouter.post('/:vehicleId/servicing/:section', (0, middleware_1.auth)(['admin', 'dispatcher']), vehicleServicingController.appendSection);
// Mount servicing sub-router directly on main router to preserve existing URL structure
router.use('/', servicingRouter);
