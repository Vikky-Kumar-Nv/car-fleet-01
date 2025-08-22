import { Router } from 'express';
import * as controller from '../controller/city.controller';
import { apiLimiter, auth } from '../middleware';

export const cityRouter = Router();

cityRouter.get('/', apiLimiter, auth(['admin','dispatcher','accountant']), controller.list);
cityRouter.post('/', apiLimiter, auth(['admin','dispatcher','accountant']), controller.create);
cityRouter.delete('/:id', apiLimiter, auth(['admin','dispatcher']), controller.remove);
