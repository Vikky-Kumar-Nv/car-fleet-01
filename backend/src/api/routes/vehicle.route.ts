// src/routes/vehicle.route.ts
import { Router } from 'express';
import * as controller from '../controller/vehicle.controller';
import { auth } from '../middleware';
import { UserRole } from '../types';

const router = Router();

router.post('/', auth(['admin', 'dispatcher']), controller.createVehicle);
router.get('/', auth(['admin', 'dispatcher']), controller.getVehicles);
router.get('/:id', auth(['admin', 'dispatcher']), controller.getVehicleById);
router.put('/:id', auth(['admin', 'dispatcher']), controller.updateVehicle);
router.delete('/:id', auth(['admin', 'dispatcher']), controller.deleteVehicle);

export { router as vehicleRouter };