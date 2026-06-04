import Meeting from '../../models/admin/Meeting.js';
import Notification from '../../models/shared/Notification.js';
import { sendPushNotification } from '../shared/pushNotificationController.js';

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

// @desc   Create a meeting (Admin only)
// @route  POST /api/meetings
export const createMeeting = async (req, res) => {
    try {
        const { title, description, meetLink, scheduledAt, duration, inviteeIds } = req.body;

        if (!title || !meetLink || !scheduledAt) {
            return res.status(400).json({ success: false, message: 'Title, meet link, and scheduled time are required.' });
        }

        const invitees = (inviteeIds || []).map(id => ({ user: id, isRead: false }));

        const meeting = await Meeting.create({
            title,
            description,
            meetLink,
            scheduledAt,
            duration: duration || 60,
            invitees,
            createdBy: req.user._id
        });

        // Create notifications for each invitee
        if (invitees.length > 0) {
            const scheduledDate = new Date(scheduledAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            const notifDocs = invitees.map(inv => ({
                title: `📅 New Meeting: ${title}`,
                description: `You have been invited to a Google Meet scheduled on ${scheduledDate}. Duration: ${duration || 60} mins.`,
                type: 'Info',
                recipient: inv.user,
                relatedModel: null,
                relatedId: meeting._id,
                createdBy: req.user._id
            }));

            await Notification.insertMany(notifDocs);

            // Send Web Push Notifications
            const inviteeObjectIds = invitees.map(inv => inv.user);
            await sendPushNotification(inviteeObjectIds, {
                title: `📅 New Meeting: ${title}`,
                body: `You have been invited to a Google Meet scheduled on ${scheduledDate}. Duration: ${duration || 60} mins.`,
                url: '/dashboard'
            });
        }

        const populated = await Meeting.findById(meeting._id)
            .populate('createdBy', 'fullName role')
            .populate('invitees.user', 'fullName role email');

        res.status(201).json({ success: true, data: enrichMeeting(populated) });
    } catch (err) {
        console.error('createMeeting error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc   Update meeting (Admin only)
// @route  PUT /api/meetings/:id
export const updateMeeting = async (req, res) => {
    try {
        const { title, description, meetLink, scheduledAt, duration, inviteeIds } = req.body;

        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });
        if (meeting.status === 'cancelled') return res.status(400).json({ success: false, message: 'Cannot update a cancelled meeting.' });

        // Track new invitees to notify
        const existingIds = meeting.invitees.map(i => String(i.user));
        const newInviteeIds = (inviteeIds || []).filter(id => !existingIds.includes(String(id)));

        if (title) meeting.title = title;
        if (description !== undefined) meeting.description = description;
        if (meetLink) meeting.meetLink = meetLink;
        if (scheduledAt) meeting.scheduledAt = scheduledAt;
        if (duration) meeting.duration = duration;
        if (inviteeIds) {
            meeting.invitees = inviteeIds.map(id => {
                const existing = meeting.invitees.find(i => String(i.user) === String(id));
                return existing || { user: id, isRead: false };
            });
        }

        await meeting.save();

        // Notify newly added invitees
        if (newInviteeIds.length > 0) {
            const scheduledDate = new Date(meeting.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
            const notifDocs = newInviteeIds.map(id => ({
                title: `📅 New Meeting: ${meeting.title}`,
                description: `You have been invited to a Google Meet scheduled on ${scheduledDate}. Duration: ${meeting.duration} mins.`,
                type: 'Info',
                recipient: id,
                relatedId: meeting._id,
                createdBy: req.user._id
            }));
            await Notification.insertMany(notifDocs);
        }

        const populated = await Meeting.findById(meeting._id)
            .populate('createdBy', 'fullName role')
            .populate('invitees.user', 'fullName role email');

        res.json({ success: true, data: enrichMeeting(populated) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc   Cancel meeting (Admin only)
// @route  PATCH /api/meetings/:id/cancel
export const cancelMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });

        meeting.status = 'cancelled';
        await meeting.save();

        res.json({ success: true, message: 'Meeting cancelled.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc   Mark meeting as read for the current user
// @route  PATCH /api/meetings/:id/read
export const markAsRead = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);
        if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found.' });

        const invitee = meeting.invitees.find(i => String(i.user) === String(req.user._id));
        if (invitee && !invitee.isRead) {
            invitee.isRead = true;
            invitee.readAt = new Date();
            await meeting.save();
        }

        res.json({ success: true, message: 'Marked as read.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
