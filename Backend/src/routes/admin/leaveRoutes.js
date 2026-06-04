import express from 'express';
const router = express.Router();
import * as leaveController from '../../controllers/admin/leaveController.js';
import { protect, authorize } from '../../middleware/auth.js';

router.use(protect); // Ensure user is authenticated for all leave routes

router.post('/', authorize('Site Engineer', 'Site Supervisor', 'Project Engineer', 'Project Manager', 'Procurement Manager', 'Store Manager', 'Admin'), leaveController.submitLeave);
router.get('/my-leaves', authorize('Site Engineer', 'Site Supervisor', 'Project Engineer', 'Project Manager', 'Procurement Manager', 'Store Manager', 'Admin'), leaveController.getMyLeaves);
router.get('/pending', authorize('Project Engineer', 'Project Manager', 'Admin'), leaveController.getPendingLeavesForManager);
router.put('/:id/status', authorize('Project Engineer', 'Project Manager', 'Admin'), leaveController.updateLeaveStatus);

export default router;
