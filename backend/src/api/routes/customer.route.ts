import { Router } from 'express';
import * as controller from '../controller/customer.controller';

const router = Router();

router.post('/', controller.createCustomer);
router.get('/', controller.getCustomers);
router.get('/:id', controller.getCustomerById);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

export { router as customerRouter };
