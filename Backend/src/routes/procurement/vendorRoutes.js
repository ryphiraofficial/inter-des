import express from 'express';
const router = express.Router();
import {  protect, authorize  } from '../../middleware/auth.js';
import {  getVendors, getVendor, createVendor, updateVendor, deleteVendor, getVendorStats  } from '../../controllers/procurement/vendorController.js';

router.use(protect);

router.route('/')
    .get(getVendors)
    .post(createVendor);

router.route('/stats')
    .get(getVendorStats);

router.route('/:id')
    .get(getVendor)
    .put(updateVendor)
    .delete(deleteVendor);

export default router;
