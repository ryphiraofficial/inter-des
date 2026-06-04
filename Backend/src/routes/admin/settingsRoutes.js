import express from 'express';
import {  getSettings, updateSettings  } from '../../controllers/admin/settingsController.js';
import {  protect, authorize  } from '../../middleware/auth.js';

const router = express.Router();

router.use(protect); // All settings routes require authentication

router.route('/')
    .get(getSettings)
    .put(authorize('Super Admin', 'Admin'), updateSettings);

export default router;
