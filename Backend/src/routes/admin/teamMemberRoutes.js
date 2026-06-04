import express from 'express';
const router = express.Router();

import { 
    getMembers,
    createMember,
    updateMember,
    deleteMember
 } from '../../controllers/admin/teamMemberController.js';

router.route('/')
    .get(getMembers)
    .post(createMember);

router.route('/:id')
    .patch(updateMember)
    .delete(deleteMember);

export default router;
