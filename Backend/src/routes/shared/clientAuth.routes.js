import express from 'express';
import { requestOTP, verifyOTP } from '../../controllers/shared/clientAuthController.js';

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);

export default router;
