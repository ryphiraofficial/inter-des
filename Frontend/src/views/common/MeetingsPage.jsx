import React, { useState, useEffect, useMemo } from 'react';
import { useGetMeetingsQuery, useMarkMeetingReadMutation } from '../../store/api/meetingApi';
import { Video, Calendar, Clock, Users, ChevronUp, ChevronDown } from 'lucide-react';
import '../admin/css/Meetings.css';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';
import { MeetingsUpcomingSkeleton, MeetingsHistorySkeleton } from './components/MeetingSkeletons';

const STATUS_CONFIG = {
    upcoming:  { label: 'Upcoming',  color: '#3b82f6', bg: '#eff6ff' },
    ongoing:   { label: 'Live Now',  color: '#10b981', bg: '#d1fae5' },
    completed: { label: 'Completed', color: '#64748b', bg: '#f1f5f9' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' }
};

const formatDateTime = (dt) => new Date(dt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });

const computeStatus = (m) => {
    if (m.status === 'cancelled') return 'cancelled';
    const now = Date.now();
    const start = new Date(m.scheduledAt).getTime();
    const end = start + m.duration * 60000;
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
};

const MeetingCard = ({ meeting, userId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [markRead] = useMarkMeetingReadMutation();
    const status  = computeStatus(meeting);
    const cfg     = STATUS_CONFIG[status];
    const invitee = meeting.invitees?.find(i => (i.user?._id || i.user) === userId);
    const isUnread = invitee && !invitee.isRead;
    const isPast   = status === 'completed' || status === 'cancelled';

    const handleJoin = async (e) => {
        e.stopPropagation();
        if (isUnread) { try { await markRead(meeting._id).unwrap(); } catch (_) {} }
        window.open(meeting.meetLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`meeting-card ${status} ${isUnread ? 'unread' : ''}`} onClick={() => isPast && setIsExpanded(!isExpanded)} style={{ cursor: isPast ? 'pointer' : 'default' }}>
            <div className="meeting-card-header" style={{ marginBottom: (!isPast || isExpanded) ? '12px' : '0' }}>
                <div className="meeting-card-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="meeting-status-badge" style={{ color: cfg.color, background: cfg.bg, marginBottom: 0 }}>
                                {status === 'ongoing' && <span className="meeting-live-dot" />}
                                {cfg.label}
                            </span>
                            {isUnread && <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid #fde68a' }}>NEW</span>}
                        </div>
                        {isPast && <div style={{ color: '#94a3b8' }}>{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>}
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
                    <button className={`meeting-join-btn ${status === 'ongoing' ? 'live' : ''}`} onClick={handleJoin}>
                        <Video size={15} /> {status === 'ongoing' ? 'Join Now' : 'Join Meeting'}
                    </button>
                </div>
            )}
        </div>
    );
};

const MeetingsPage = () => {
    const { data: mRes, isLoading: loading, refetch: fetchMeetings } = useGetMeetingsQuery();
    const meetings = useMemo(() => mRes?.data || [], [mRes]);
    const [markRead] = useMarkMeetingReadMutation();
    const user   = useAppSelector(selectUser);
    const userId = user?._id;

    useEffect(() => {
        if (!meetings.length) return;
        meetings.forEach(m => {
            const inv = m.invitees?.find(i => (i.user?._id || i.user) === userId);
            if (inv && !inv.isRead) markRead(m._id).unwrap().catch(() => {});
        });
    }, [meetings, userId, markRead]);

    const upcoming = meetings.filter(m => ['upcoming', 'ongoing'].includes(computeStatus(m)));
    const past     = meetings.filter(m => ['completed', 'cancelled'].includes(computeStatus(m)));

    return (
        <div className="staff-meetings-page">
            {loading ? (
                <div className="staff-meetings-split-layout">
                    <MeetingsUpcomingSkeleton />
                    <MeetingsHistorySkeleton />
                </div>
            ) : meetings.length === 0 ? (
                <div className="meetings-empty">
                    <Video size={48} />
                    <h3>No meetings scheduled</h3>
                    <p>Your admin will notify you when a Google Meet session is planned for you.</p>
                </div>
            ) : (
                <div className="staff-meetings-split-layout">
                    <div className="meetings-upcoming-section">
                        <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Upcoming &amp; Live</p>
                        {upcoming.length > 0 ? (
                            <div className="meetings-list">
                                {upcoming.map(m => <MeetingCard key={m._id} meeting={m} userId={userId} />)}
                            </div>
                        ) : <div className="meetings-empty-mini"><p>No upcoming meetings.</p></div>}
                    </div>
                    <div className="meetings-history-section">
                        <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Meeting History</p>
                        {past.length > 0 ? (
                            <div className="meetings-list" style={{ gridTemplateColumns: '1fr' }}>
                                {past.map(m => <MeetingCard key={m._id} meeting={m} userId={userId} />)}
                            </div>
                        ) : <div className="meetings-empty-mini"><p>No past meetings found.</p></div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeetingsPage;
