import express from 'express';
import {
    submitStaffReport,
    getStaffReports,
    updateStaffReportStatus,
    updateStaffReport,
    forwardWeeklyReports
} from '../../controllers/admin/staffReportController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Routes for both staff and admins
router.route('/')
    .post(submitStaffReport)
    .get(getStaffReports);

router.route('/:id')
    .put(updateStaffReport);

// Routes for admins only
router.post('/forward-weekly', authorize('Super Admin', 'Admin', 'Manager', 'super admin', 'admin', 'superadmin', 'manager', 'Design Manager', 'design manager', 'Procurement Manager', 'procurement manager', 'Project Manager', 'project manager', 'Accounts Manager', 'accounts manager'), forwardWeeklyReports);
router.patch('/:id/status', authorize('Super Admin', 'Admin', 'Manager', 'super admin', 'admin', 'superadmin', 'manager', 'Design Manager', 'design manager', 'Procurement Manager', 'procurement manager', 'Project Manager', 'project manager', 'Accounts Manager', 'accounts manager'), updateStaffReportStatus);

export default router;
