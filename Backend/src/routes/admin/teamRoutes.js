import express from 'express';
import { 
    getTeams,
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember
 } from '../../controllers/admin/teamController.js';

const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getTeams)
    .post(authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager'), createTeam);

router.route('/:id')
    .get(getTeam)
    .put(authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager'), updateTeam)
    .delete(authorize('Super Admin', 'Admin'), deleteTeam);

router.post('/:id/members', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager'), addMember);
router.delete('/:id/members/:userId', authorize('Super Admin', 'Admin', 'Manager', 'Design Manager', 'Procurement Manager', 'Project Manager', 'Accounts Manager'), removeMember);

export default router;
