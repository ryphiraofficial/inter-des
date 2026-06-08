import express from 'express';
const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';
import {  
    getMaterialRequests, 
    createMaterialRequest, 
    updateMaterialRequest, 
    createVendorComparison, 
    getVendorComparisons, 
    selectVendor, 
    createPOFromComparison, 
    getProcurementStats,
    assignStaffToRequest,
    getStaffTasks,
    requestTimeExtension,
    respondTimeExtension,
    createVendorPurchase,
    getVendorPurchaseHistory,
    compareVendorPrices,
    getProcurementStaff,
    updatePurchaseStatus,
    approveMaterialRequest,
    adminApproveProcurement,
    getProductionManagers,
    getProcurementManagers
 } from '../../controllers/procurement/procurementController.js';

router.use(protect);

router.route('/material-requests')
    .get(getMaterialRequests)
    .post(createMaterialRequest);

router.route('/material-requests/:id/approve-release')
    .put(authorize('Design Manager'), approveMaterialRequest);

router.route('/material-requests/:id')
    .put(updateMaterialRequest);

router.route('/material-requests/:id/assign')
    .put(assignStaffToRequest);

router.route('/material-requests/:id/time-extension')
    .post(requestTimeExtension)
    .put(respondTimeExtension);

router.route('/vendor-comparisons')
    .get(getVendorComparisons)
    .post(createVendorComparison);

router.route('/vendor-comparisons/:id/select-vendor')
    .put(selectVendor);

router.route('/vendor-comparisons/:id/create-po')
    .post(createPOFromComparison);

router.route('/stats')
    .get(getProcurementStats);

router.route('/staff-tasks')
    .get(getStaffTasks);

router.route('/staff')
    .get(getProcurementStaff);

// Admin procurement approval routes
router.route('/production-managers')
    .get(getProductionManagers);

router.route('/managers')
    .get(getProcurementManagers);

router.route('/admin-approve/:id')
    .put(authorize('Super Admin', 'Admin'), adminApproveProcurement);

router.route('/vendor-purchases')
    .post(createVendorPurchase)
    .get(getVendorPurchaseHistory);

router.route('/vendor-purchases/compare')
    .post(compareVendorPrices);

router.route('/vendor-purchases/:id')
    .put(updatePurchaseStatus);

export default router;
