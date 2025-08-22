// src/api/routes/fuel.route.ts
import { Router } from 'express';
import { auth, apiLimiter } from '../middleware';
import * as controller from '../controller/fuel.controller';

export const fuelRouter = Router();

// All fuel routes restricted to admin/accountant/dispatcher for now
fuelRouter.post('/', apiLimiter, auth(['admin','accountant','dispatcher']), controller.createFuel);
fuelRouter.get('/', apiLimiter, auth(['admin','accountant','dispatcher']), controller.listFuel);
fuelRouter.get('/:id', apiLimiter, auth(['admin','accountant','dispatcher']), controller.getFuel);
fuelRouter.put('/:id', apiLimiter, auth(['admin','accountant','dispatcher']), controller.updateFuel);
fuelRouter.delete('/:id', apiLimiter, auth(['admin','accountant','dispatcher']), controller.deleteFuel);
