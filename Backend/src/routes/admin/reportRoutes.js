import express from 'express';
import { 
    getDashboardStats,
    getRevenueReport,
    getQuotationReport,
    getInventoryReport
 } from '../../controllers/admin/reportController.js';

const router = express.Router();
import {  protect  } from '../../middleware/auth.js';

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueReport);
router.get('/quotations', getQuotationReport);
router.get('/inventory', getInventoryReport);

export default router;
