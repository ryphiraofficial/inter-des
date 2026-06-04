import express from 'express';
import { getAllStaff, getStaffById } from '../../controllers/admin/staffQueryController.js';
import { createStaff, updateStaff, deleteStaff } from '../../controllers/admin/staffMutationController.js';
import { getStaffAnalytics, getAllStaffAnalytics } from '../../controllers/admin/staffAnalyticsController.js';
import { getStaffSalary, updateStaffSalary } from '../../controllers/admin/staffSalaryController.js';

const router = express.Router();
import { protect } from '../../middleware/auth.js';

router.use(protect); // All routes are protected

// Analytics overview must be above /:id to avoid route conflict
router.get('/analytics/overview', getAllStaffAnalytics);

router
    .route('/')
    .get(getAllStaff)
    .post(createStaff);

router
    .route('/:id')
    .get(getStaffById)
    .put(updateStaff)
    .delete(deleteStaff);

router.get('/:id/analytics', getStaffAnalytics);
router.get('/:id/salary', getStaffSalary);
router.put('/:id/salary', updateStaffSalary);

export default router;
