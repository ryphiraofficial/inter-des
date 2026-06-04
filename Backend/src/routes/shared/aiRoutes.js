import express from 'express';
import {  queryAI, getSuggestion  } from '../../controllers/shared/aiController.js';
import {  protect  } from '../../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/query', queryAI);
router.post('/suggest', getSuggestion);

export default router;
