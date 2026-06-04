import express from 'express';
import { 
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    recordPayment,
    getInvoiceStats
 } from '../../controllers/sales/invoiceController.js';

const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getInvoices)
    .post(createInvoice);

router.get('/stats', getInvoiceStats);

router.route('/:id')
    .get(getInvoice)
    .put(updateInvoice)
    .delete(authorize('Super Admin', 'Admin'), deleteInvoice);

router.put('/:id/payment', recordPayment);

export default router;
