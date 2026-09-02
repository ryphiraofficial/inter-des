import express from 'express';
import { 
    getQuotations,
    getQuotation,
    getQuotationStats,
    getVersionHistory,
    compareVersions
} from '../../controllers/sales/quotationQueryController.js';
import {
    createQuotation,
    updateQuotation,
    deleteQuotation,
    approveQuotation,
    calculateTotals
} from '../../controllers/sales/quotationMutationController.js';

const router = express.Router();
import { protect, authorize } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getQuotations)
    .post(createQuotation);

router.get('/stats', getQuotationStats);
router.post('/calculate-totals', calculateTotals);

router.route('/:id')
    .get(getQuotation)
    .put(updateQuotation)
    .delete(authorize('Super Admin', 'Admin', 'Sales', 'Sales Staff', 'Sales Executive', 'Sales Manager'), deleteQuotation);

router.put('/:id/approve', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager'), approveQuotation);
router.get('/:id/versions', getVersionHistory);
router.get('/:id/compare', compareVersions);

export default router;
