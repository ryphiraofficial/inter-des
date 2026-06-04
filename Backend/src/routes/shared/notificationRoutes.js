import express from 'express';
import { 
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
 } from '../../controllers/shared/notificationController.js';

const router = express.Router();
import {  protect  } from '../../middleware/auth.js';

router.use(protect);

router.route('/')
    .get(getNotifications)
    .post(createNotification);

router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);

router.route('/:id')
    .delete(deleteNotification);

router.put('/:id/read', markAsRead);

export default router;
