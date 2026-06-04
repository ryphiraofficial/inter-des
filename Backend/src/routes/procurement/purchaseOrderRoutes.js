import express from 'express';
import { 
    getPurchaseOrders,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    approvePurchaseOrder,
    markAsReceived,
    getPOStats
 } from '../../controllers/procurement/purchaseOrderController.js';

const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getPurchaseOrders)
    .post(createPurchaseOrder);

router.get('/stats', getPOStats);

router.route('/:id')
    .get(getPurchaseOrder)
    .put(updatePurchaseOrder)
    .delete(authorize('Super Admin', 'Admin'), deletePurchaseOrder);

router.put('/:id/approve', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager'), approvePurchaseOrder);
router.put('/:id/receive', markAsReceived);

export default router;
