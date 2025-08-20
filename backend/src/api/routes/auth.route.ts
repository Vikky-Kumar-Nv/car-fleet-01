// src/routes/auth.route.ts
import { Router } from 'express';
import * as controller from '../controller/auth.controller';
import { loginLimiter, apiLimiter } from '../middleware';

const router = Router();

router.post('/register', apiLimiter, controller.register);
router.post('/login', loginLimiter, controller.login);
router.get('/users', apiLimiter, controller.getUsers);
router.get('/users/:id', apiLimiter, controller.getUserById);
router.put('/users/:id', apiLimiter, controller.updateUser);
router.delete('/users/:id', apiLimiter, controller.deleteUser);

export { router as authRouter };