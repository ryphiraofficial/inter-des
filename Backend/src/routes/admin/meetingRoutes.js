import express from 'express';
const router = express.Router();
import { protect } from '../../middleware/auth.js';
import { getMeetings, getMeetingById, getAllUsers } from '../../controllers/admin/meetingQueryController.js';
import { createMeeting, updateMeeting, cancelMeeting, markAsRead } from '../../controllers/admin/meetingMutationController.js';

// Admin-only guard
const adminOnly = (req, res, next) => {
    const role = req.user?.role?.toLowerCase();
    if (!['super admin', 'admin', 'superadmin'].includes(role)) {
        return res.status(403).json({ success: false, message: 'Access denied: Admins only.' });
    }
    next();
};

router.use(protect);

// Admin — fetch all users for invitee picker
router.get('/users', adminOnly, getAllUsers);

// All authenticated users — get meetings (role-filtered in controller)
router.get('/', getMeetings);
router.get('/:id', getMeetingById);

// Staff — mark a specific meeting as read for themselves
router.patch('/:id/read', markAsRead);

// Admin only
router.post('/', adminOnly, createMeeting);
router.put('/:id', adminOnly, updateMeeting);
router.patch('/:id/cancel', adminOnly, cancelMeeting);

export default router;
