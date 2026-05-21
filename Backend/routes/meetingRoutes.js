const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    createMeeting,
    getMeetings,
    getMeetingById,
    updateMeeting,
    cancelMeeting,
    markAsRead,
    getAllUsers
} = require('../controllers/meetingController');

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

module.exports = router;
