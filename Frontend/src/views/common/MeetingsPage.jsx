import React, { useState, useEffect, useCallback } from 'react';
import { meetingAPI } from '../../models/api/shared/meetingAPI';
import { Video, Calendar, Clock, Users, Loader, CheckCircle } from 'lucide-react';
import '../admin/css/Meetings.css';

const STATUS_CONFIG = {
    upcoming:  { label: 'Upcoming',  color: '#3b82f6', bg: '#eff6ff' },
    ongoing:   { label: 'Live Now',  color: '#10b981', bg: '#d1fae5' },
    completed: { label: 'Completed', color: '#64748b', bg: '#f1f5f9' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' }
};

const formatDateTime = (dt) =>
    new Date(dt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

const computeStatus = (m) => {
    if (m.status === 'cancelled') return 'cancelled';
    const now = Date.now();
    const start = new Date(m.scheduledAt).getTime();
    const end = start + m.duration * 60000;
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
};

const MeetingCard = ({ meeting, userId, onRead }) => {
    const status = computeStatus(meeting);
    const cfg = STATUS_CONFIG[status];
    const invitee = meeting.invitees?.find(i => (i.user?._id || i.user) === userId);
    const isUnread = invitee && !invitee.isRead;

    const handleJoin = async () => {
        if (isUnread) {
            try { await meetingAPI.markRead(meeting._id); onRead(); } catch (_) {}
        }
        window.open(meeting.meetLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`meeting-card ${status} ${isUnread ? 'unread' : ''}`}>
            <div className="meeting-card-header">
                <div className="meeting-card-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span className="meeting-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                            {status === 'ongoing' && <span className="meeting-live-dot" />}
                            {cfg.label}
                        </span>
                        {isUnread && (
                            <span style={{
                                background: '#fef3c7', color: '#d97706',
                                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                                borderRadius: 99, border: '1px solid #fde68a'
                            }}>NEW</span>
                        )}
                    </div>
                    <h3 className="meeting-card-title">{meeting.title}</h3>
                    {meeting.description && <p className="meeting-card-desc">{meeting.description}</p>}
                </div>
            </div>

            <div className="meeting-card-meta">
                <span><Calendar size={14} />{formatDateTime(meeting.scheduledAt)}</span>
                <span><Clock size={14} />{meeting.duration} mins</span>
                <span><Users size={14} />Organized by {meeting.createdBy?.fullName || 'Admin'}</span>
            </div>

            {(status === 'upcoming' || status === 'ongoing') && (
                <div className="meeting-card-footer" style={{ justifyContent: 'flex-end' }}>
                    <button
                        className={`meeting-join-btn ${status === 'ongoing' ? 'live' : ''}`}
                        onClick={handleJoin}
                    >
                        <Video size={15} />
                        {status === 'ongoing' ? 'Join Now' : 'Join Meeting'}
                    </button>
                </div>
            )}
        </div>
    );
};

const MeetingsPage = ({ user }) => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = user?._id;

    const fetchMeetings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await meetingAPI.getAll();
            setMeetings(res.data || []);
        } catch (err) {
            console.error('MeetingsPage fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

    // Mark all unread meetings as read on page load
    useEffect(() => {
        if (!meetings.length) return;
        meetings.forEach(m => {
            const inv = m.invitees?.find(i => (i.user?._id || i.user) === userId);
            if (inv && !inv.isRead) {
                meetingAPI.markRead(m._id).catch(() => {});
            }
        });
    }, [meetings, userId]);

    const upcoming  = meetings.filter(m => ['upcoming', 'ongoing'].includes(computeStatus(m)));
    const past      = meetings.filter(m => ['completed', 'cancelled'].includes(computeStatus(m)));

    return (
        <div className="staff-meetings-page">
            {loading ? (
                <div className="meetings-loading">
                    <Loader className="spin" size={24} /> Loading your meetings...
                </div>
            ) : (
                    {meetings.length === 0 ? (
                        <div className="meetings-empty">
                            <Video size={48} />
                            <h3>No meetings scheduled</h3>
                            <p>Your admin will notify you when a Google Meet session is planned for you.</p>
                        </div>
                    ) : (
                        <>
                            {upcoming.length > 0 && (
                                <>
                                    <p className="staff-meetings-section-title">Upcoming & Live</p>
                                    <div className="meetings-list">
                                        {upcoming.map(m => (
                                            <MeetingCard key={m._id} meeting={m} userId={userId} onRead={fetchMeetings} />
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {past.length > 0 ? (
                                <>
                                    <p className="staff-meetings-section-title">Meeting History</p>
                                    <div className="meetings-list">
                                        {past.map(m => (
                                            <MeetingCard key={m._id} meeting={m} userId={userId} onRead={fetchMeetings} />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="staff-meetings-section-title">Meeting History</p>
                                    <div className="meetings-empty-mini">
                                        <p>No past meetings found.</p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default MeetingsPage;
