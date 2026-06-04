import express from 'express';
import { 
    getSiteVisits,
    createSiteVisit,
    getTaskVisits
 } from '../../controllers/production/siteVisitController.js';

const router = express.Router();
import {  protect  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getSiteVisits)
    .post(createSiteVisit);

router.get('/task/:taskId', getTaskVisits);

export default router;
