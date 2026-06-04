import express from 'express';
import { 
    getPOInventoryItems,
    getPOInventoryItem,
    createPOInventoryItem,
    updatePOInventoryItem,
    deletePOInventoryItem
 } from '../../controllers/procurement/poInventoryController.js';

const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getPOInventoryItems)
    .post(createPOInventoryItem);

router.route('/:id')
    .get(getPOInventoryItem)
    .put(updatePOInventoryItem)
    .delete(authorize('Super Admin', 'Admin'), deletePOInventoryItem);

export default router;
