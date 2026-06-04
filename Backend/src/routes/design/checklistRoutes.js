import express from 'express';
const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';
import {  getChecklist, createChecklist, updateChecklistStep, addChecklistStep, deleteChecklistStep  } from '../../controllers/design/checklistController.js';

router.use(protect);

router.route('/project/:projectId')
    .get(getChecklist)
    .post(createChecklist);

router.route('/project/:projectId/step/:stepId')
    .put(updateChecklistStep)
    .delete(deleteChecklistStep);

router.route('/project/:projectId/step')
    .post(addChecklistStep);

export default router;
