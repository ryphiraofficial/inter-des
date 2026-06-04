import express from 'express';
const router = express.Router();

import { 
    getApprovals,
    createApproval,
    updateApproval,
    deleteApproval
 } from '../../controllers/shared/approvalController.js';

router.route('/')
    .get(getApprovals)
    .post(createApproval);

router.route('/:id')
    .patch(updateApproval)
    .delete(deleteApproval);

export default router;
