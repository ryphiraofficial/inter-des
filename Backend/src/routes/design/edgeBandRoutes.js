import express from 'express';
import { protect } from '../../middleware/auth.js';
import {
    getBrands,
    searchEdgeBands,
    getEdgeBandById,
    saveSelections,
    getProjectSelections,
    deleteSelection,
    submitRequest,
    getRequests,
    managerReviewRequest,
    adminReviewRequest,
    createProcurementQueue,
    getProcurementQueue,
    selectProcurementCandidate,
    markGroupNeedsPurchase,
    assignProcurementStaff
} from '../../controllers/design/edgeBandController.js';

const router = express.Router();

router.use(protect);

router.get('/brands', getBrands);
router.get('/search', searchEdgeBands);
router.get('/selections/:projectId', getProjectSelections);
router.get('/requests', getRequests);
router.post('/requests', submitRequest);
router.patch('/requests/:id/manager-review', managerReviewRequest);
router.patch('/requests/:id/admin-review', adminReviewRequest);
// Procurement queue
router.route('/procurement-queue').get(getProcurementQueue).post(createProcurementQueue);
router.patch('/procurement-queue/:id/assign', assignProcurementStaff);
router.patch('/procurement-queue/:groupId/select', selectProcurementCandidate);
router.patch('/procurement-queue/:groupId/needs-purchase', markGroupNeedsPurchase);
router.get('/:id', getEdgeBandById);
router.post('/selections', saveSelections);
router.delete('/selections/:id', deleteSelection);

export default router;

