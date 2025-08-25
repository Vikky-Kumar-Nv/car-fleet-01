// src/routes/vehicles.route.ts
import { Router } from 'express';
import * as vehicleController from '../controller/vehicle.controller';
import * as vehicleCategoryController from '../controller/vehicleCategory.controller';
import * as vehicleServicingController from '../controller/vehicleServicing.controller';
import { auth, upload } from '../middleware';

const router = Router();

// Main vehicle routes - /vehicles/*
router.post('/', auth(['admin', 'dispatcher']), upload, vehicleController.createVehicle);
router.get('/', auth(['admin', 'dispatcher']), vehicleController.getVehicles);
router.get('/:id', auth(['admin', 'dispatcher']), vehicleController.getVehicleById);
router.put('/:id', auth(['admin', 'dispatcher']), upload, vehicleController.updateVehicle);
router.delete('/:id', auth(['admin', 'dispatcher']), vehicleController.deleteVehicle);

// Vehicle category routes - /vehicles/categories/*
const categoryRouter = Router();
categoryRouter.post('/', auth(['admin', 'dispatcher']), vehicleCategoryController.createVehicleCategory);
categoryRouter.get('/', auth(['admin', 'dispatcher']), vehicleCategoryController.getVehicleCategories);
categoryRouter.get('/:id', auth(['admin', 'dispatcher']), vehicleCategoryController.getVehicleCategoryById);
categoryRouter.put('/:id', auth(['admin', 'dispatcher']), vehicleCategoryController.updateVehicleCategory);
categoryRouter.delete('/:id', auth(['admin', 'dispatcher']), vehicleCategoryController.deleteVehicleCategory);

// Mount category sub-router
router.use('/categories', categoryRouter);

// Vehicle servicing routes - /vehicles/:vehicleId/servicing/*
const servicingRouter = Router({ mergeParams: true });
servicingRouter.get('/:vehicleId/servicing', auth(['admin','dispatcher']), vehicleServicingController.getServicing);
servicingRouter.put('/:vehicleId/servicing', auth(['admin','dispatcher']), vehicleServicingController.upsertServicing);
servicingRouter.post('/:vehicleId/servicing/:section', auth(['admin','dispatcher']), vehicleServicingController.appendSection);

// Mount servicing sub-router directly on main router to preserve existing URL structure
router.use('/', servicingRouter);

export { router as vehiclesRouter };