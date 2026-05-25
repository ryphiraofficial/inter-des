import React, { useState, useEffect, useCallback } from 'react';
import { meetingAPI } from '../../models/api/shared/meetingAPI';
import { Video, Calendar, Clock, Users, Loader, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';
import Skeleton from '../common/Skeleton';
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
    const [isExpanded, setIsExpanded] = useState(false);
    const status = computeStatus(meeting);
    const cfg = STATUS_CONFIG[status];
    const invitee = meeting.invitees?.find(i => (i.user?._id || i.user) === userId);
    const isUnread = invitee && !invitee.isRead;
    const isPast = status === 'completed' || status === 'cancelled';

    const handleJoin = async (e) => {
        e.stopPropagation();
        if (isUnread) {
            try { await meetingAPI.markRead(meeting._id); onRead(); } catch (_) {}
        }
        window.open(meeting.meetLink, '_blank', 'noopener,noreferrer');
    };

    const toggleExpand = () => {
        if (isPast) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div 
            className={`meeting-card ${status} ${isUnread ? 'unread' : ''}`}
            onClick={toggleExpand}
            style={{ cursor: isPast ? 'pointer' : 'default' }}
        >
            <div className="meeting-card-header" style={{ marginBottom: (!isPast || isExpanded) ? '12px' : '0' }}>
                <div className="meeting-card-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="meeting-status-badge" style={{ color: cfg.color, background: cfg.bg, marginBottom: 0 }}>
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
                        {isPast && (
                            <div style={{ color: '#94a3b8' }}>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                        )}
                    </div>
                    <h3 className="meeting-card-title">{meeting.title}</h3>
                    {isPast && !isExpanded && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px', marginTop: '6px' }}>
                            <Calendar size={12} color="#94a3b8" /> {formatDateTime(meeting.scheduledAt)}
                        </span>
                    )}
                    {(!isPast || isExpanded) && meeting.description && (
                        <p className="meeting-card-desc" style={{ marginTop: '4px' }}>{meeting.description}</p>
                    )}
                </div>
            </div>

            {(!isPast || isExpanded) && (
                <div className="meeting-card-meta" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}><Calendar size={14} color="#94a3b8" /> {formatDateTime(meeting.scheduledAt)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}><Clock size={14} color="#94a3b8" /> {meeting.duration} mins</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', gridColumn: '1 / -1' }}><Users size={14} color="#94a3b8" /> Organized by <strong style={{ color: '#334155', fontWeight: 600 }}>{meeting.createdBy?.fullName || 'Admin'}</strong></span>
                </div>
            )}

            {(status === 'upcoming' || status === 'ongoing') && (
                <div className="meeting-card-footer" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
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
                <div className="staff-meetings-split-layout">
                    <div className="meetings-upcoming-section">
                        <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Upcoming & Live</p>
                        <div className="meetings-list">
                            {[1, 2].map(idx => (
                                <div key={idx} className="meeting-card" style={{ padding: '20px' }}>
                                    <div className="meeting-card-header" style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <Skeleton width="80px" height="24px" borderRadius="12px" />
                                        </div>
                                        <Skeleton width="60%" height="20px" style={{ marginBottom: '8px' }} />
                                        <Skeleton width="40%" height="14px" />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                        <Skeleton width="100px" height="14px" />
                                        <Skeleton width="80px" height="14px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="meetings-history-section">
                        <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Meeting History</p>
                        <div className="meetings-list" style={{ gridTemplateColumns: '1fr' }}>
                            {[1, 2, 3].map(idx => (
                                <div key={idx} className="meeting-card" style={{ padding: '16px' }}>
                                    <div className="meeting-card-header">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <Skeleton width="80px" height="20px" borderRadius="12px" />
                                        </div>
                                        <Skeleton width="50%" height="18px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {meetings.length === 0 ? (
                        <div className="meetings-empty">
                            <Video size={48} />
                            <h3>No meetings scheduled</h3>
                            <p>Your admin will notify you when a Google Meet session is planned for you.</p>
                        </div>
                    ) : (
                        <div className="staff-meetings-split-layout">
                            <div className="meetings-upcoming-section">
                                <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Upcoming & Live</p>
                                {upcoming.length > 0 ? (
                                    <div className="meetings-list">
                                        {upcoming.map(m => (
                                            <MeetingCard key={m._id} meeting={m} userId={userId} onRead={fetchMeetings} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="meetings-empty-mini">
                                        <p>No upcoming meetings.</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="meetings-history-section">
                                <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Meeting History</p>
                                {past.length > 0 ? (
                                    <div className="meetings-list" style={{ gridTemplateColumns: '1fr' }}>
                                        {past.map(m => (
                                            <MeetingCard key={m._id} meeting={m} userId={userId} onRead={fetchMeetings} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="meetings-empty-mini">
                                        <p>No past meetings found.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MeetingsPage;
