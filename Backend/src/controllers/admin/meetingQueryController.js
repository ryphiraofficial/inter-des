import Meeting from '../../models/admin/Meeting.js';
import User from '../../models/admin/User.js';

// Helper — compute live status
const computeStatus = (meeting) => {
    if (meeting.status === 'cancelled') return 'cancelled';
    const now = new Date();
    const start = new Date(meeting.scheduledAt);
    const end = new Date(start.getTime() + meeting.duration * 60000);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
};

const enrichMeeting = (meeting) => {
    const obj = meeting.toObject({ virtuals: true });
    obj.computedStatus = computeStatus(meeting);
    return obj;
};

// @desc   Get meetings
//         Admin → all meetings
//         Staff → only their invites
// @route  GET /api/meetings
export const getMeetings = async (req, res) => {
    try {
        const isAdmin = ['super admin', 'admin', 'superadmin'].includes(req.user.role?.toLowerCase());
        let query = {};

        if (!isAdmin) {
            query = { 'invitees.user': req.user._id, status: { $ne: 'cancelled' } };
        }

        const meetings = await Meeting.find(query)
            .populate('createdBy', 'fullName role')
            .populate('invitees.user', 'fullName role email')
            .sort({ scheduledAt: -1 });

        const enriched = meetings.map(enrichMeeting);

        // For staff: calculate unread count
        let unreadCount = 0;
        if (!isAdmin) {
            unreadCount = meetings.filter(m => {
                const inv = m.invitees.find(i => String(i.user._id) === String(req.user._id));
                return inv && !inv.isRead;
            }).length;
        }

        res.json({ success: true, data: enriched, unreadCount });
    } catch (err) {
        console.error('getMeetings error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc   Get single meeting
// @route  GET /api/meetings/:id
export const getMeetingById = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate('createdBy', 'fullName role')
            .populate('invitees.user', 'fullName role email');

        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting not found.' });
        }

        res.json({ success: true, data: enrichMeeting(meeting) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc   Get all users (for invitee picker in admin)
// @route  GET /api/meetings/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'fullName role email').sort({ fullName: 1 });
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
