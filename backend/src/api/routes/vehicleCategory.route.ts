// src/routes/vehicleCategory.route.ts
import { Router } from 'express';
import * as controller from '../controller/vehicleCategory.controller';
import { auth } from '../middleware';

const router = Router();

router.post('/', auth(['admin', 'dispatcher']), controller.createVehicleCategory);
router.get('/', auth(['admin', 'dispatcher']), controller.getVehicleCategories);
router.get('/:id', auth(['admin', 'dispatcher']), controller.getVehicleCategoryById);
router.put('/:id', auth(['admin', 'dispatcher']), controller.updateVehicleCategory);
router.delete('/:id', auth(['admin', 'dispatcher']), controller.deleteVehicleCategory);

export { router as vehicleCategoryRouter };
