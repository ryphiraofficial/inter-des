import express from 'express';
const router = express.Router();
import { protect, authorize } from '../../middleware/auth.js';

import { createProject } from '../../controllers/design/projectCreationController.js';
import { updateProject, updateProjectStage, performHandoff, approveFinalHandover, deleteProject } from '../../controllers/design/projectUpdateController.js';
import { getProjects, getProject, getProjectStats, getProjectsByStage, getWorkflowChecklist, validateHandoff } from '../../controllers/design/projectQueryController.js';
import { accountsCollectPayment, adminClearPaymentToProcurement } from '../../controllers/design/taskController.js';

router.use(protect);

router.route('/')
    .get(getProjects)
    .post(createProject);

router.route('/stats')
    .get(getProjectStats);

router.route('/stage/:stage')
    .get(getProjectsByStage);

router.route('/:id')
    .get(getProject)
    .put(updateProject)
    .delete(authorize('Super Admin', 'Admin'), deleteProject);

router.route('/:id/stage')
    .put(updateProjectStage);

router.route('/:id/handoff/validate')
    .get(validateHandoff);

router.route('/:id/handoff')
    .post(performHandoff);

router.route('/:id/workflow-checklist')
    .get(getWorkflowChecklist);

router.route('/:id/final-handover')
    .post(approveFinalHandover);

router.route('/:id/accounts-collect')
    .put(accountsCollectPayment);

router.route('/:id/admin-clear-payment')
    .put(adminClearPaymentToProcurement);

export default router;
