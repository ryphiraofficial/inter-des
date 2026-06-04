import express from 'express';
import { 
    getInventoryItems,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryStats
 } from '../../controllers/procurement/inventoryController.js';

const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getInventoryItems)
    .post(createInventoryItem);

router.get('/stats', getInventoryStats);

router.route('/:id')
    .get(getInventoryItem)
    .put(updateInventoryItem)
    .delete(authorize('Super Admin', 'Admin'), deleteInventoryItem);

export default router;
