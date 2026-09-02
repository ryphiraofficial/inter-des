import express from 'express';
import { 
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    getClientStats
 } from '../../controllers/sales/clientController.js';

const router = express.Router();

import {  protect, authorize  } from '../../middleware/auth.js';

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getClients)
    .post(createClient);

router.get('/stats', getClientStats);

router.route('/:id')
    .get(getClient)
    .put(updateClient)
    .delete(authorize('Super Admin', 'Admin', 'Sales', 'Sales Staff', 'Sales Executive', 'Sales Manager'), deleteClient);

export default router;
