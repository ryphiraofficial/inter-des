import express from 'express';
import { getMilestonesData } from '../../controllers/admin/milestonesController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Production Manager', 'Project Manager', 'Accounts Manager'), getMilestonesData);

export default router;
