import express from 'express';
import {
    submitStaffReport,
    getStaffReports,
    updateStaffReportStatus
} from '../../controllers/admin/staffReportController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Routes for both staff and admins
router.route('/')
    .post(submitStaffReport)
    .get(getStaffReports);

// Routes for admins only
router.patch('/:id/status', authorize('admin', 'superadmin', 'manager'), updateStaffReportStatus);

export default router;
