import express from 'express';
const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';
import {  getProductionTasks, createProductionTask, updateProductionTask, getProjectPipeline, getProductionStats, reportIssue  } from '../../controllers/production/productionController.js';

router.use(protect);

router.route('/tasks')
    .get(getProductionTasks)
    .post(createProductionTask);

router.route('/tasks/:id')
    .put(updateProductionTask);

router.route('/tasks/:taskId/report-issue')
    .post(reportIssue);

router.route('/pipeline')
    .get(getProjectPipeline);

router.route('/stats')
    .get(getProductionStats);

export default router;
