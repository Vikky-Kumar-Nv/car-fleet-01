// src/routes/payment.route.ts
import { Router } from 'express';
import * as controller from '../controller/payment.controller';
import { auth } from '../middleware';
import { UserRole } from '../types';

const router = Router();

router.post('/', auth(['admin', 'accountant']), controller.createPayment);
router.get('/', auth(['admin', 'accountant']), controller.getPayments);

export { router as paymentRouter };