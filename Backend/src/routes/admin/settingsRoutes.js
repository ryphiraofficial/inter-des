import express from 'express';
import { getSettings, updateSettings, getPublicSettings } from '../../controllers/admin/settingsController.js';
import { protect, authorize } from '../../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicSettings);

router.use(protect); // All settings routes below require authentication

router.route('/')
    .get(getSettings)
    .put(authorize('Super Admin', 'Admin'), updateSettings);

export default router;
