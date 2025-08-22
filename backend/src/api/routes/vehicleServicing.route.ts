// src/routes/vehicleServicing.route.ts
import { Router } from 'express';
import * as controller from '../controller/vehicleServicing.controller';
import { auth } from '../middleware';

const router = Router({ mergeParams: true });

// Fetch full servicing doc for a vehicle
router.get('/:vehicleId/servicing', auth(['admin','dispatcher']), controller.getServicing);
// Upsert full servicing data (replace arrays provided)
router.put('/:vehicleId/servicing', auth(['admin','dispatcher']), controller.upsertServicing);
// Append entries to a specific section
router.post('/:vehicleId/servicing/:section', auth(['admin','dispatcher']), controller.appendSection);

export { router as vehicleServicingRouter };
