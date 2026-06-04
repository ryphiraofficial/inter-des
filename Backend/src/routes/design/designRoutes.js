import express from 'express';
const router = express.Router();
import { protect, authorize } from '../../middleware/auth.js';
import { getManagerDashboard } from '../../controllers/design/designManagerDashboardController.js';
import { getStaffDashboard, getOverdueTasks, getStaffPerformance } from '../../controllers/design/designStaffDashboardController.js';

router.use(protect);

router.get('/dashboard/manager', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager'), getManagerDashboard);

router.get('/dashboard/staff', getStaffDashboard);

router.get('/tasks/overdue', getOverdueTasks);

router.get('/staff/performance', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager'), getStaffPerformance);

export default router;
