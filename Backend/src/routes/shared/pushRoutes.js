import express from 'express';
import { protect } from '../../middleware/auth.js';
import { subscribeUser, unsubscribeUser } from '../../controllers/shared/pushNotificationController.js';

const router = express.Router();

router.post('/subscribe', protect, subscribeUser);
router.post('/unsubscribe', protect, unsubscribeUser);

export default router;
