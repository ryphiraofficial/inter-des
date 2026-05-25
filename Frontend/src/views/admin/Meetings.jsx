import React, { useState, useEffect, useCallback } from 'react';
import { meetingAPI } from '../../models/api/shared/meetingAPI';
import {
    Video, Plus, X, Users, Link2, Calendar,
    Edit2, XCircle, Search, CheckCircle, AlertCircle,
    Loader, Clock
} from 'lucide-react';
import { Calendar as CalendarUI } from '../../components/ui/calendar.jsx';
import { TimePicker } from '../../components/ui/time-picker.jsx';
import 'react-day-picker/style.css';
import './css/Meetings.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    upcoming:  { label: 'Upcoming',  color: '#3b82f6', bg: '#eff6ff' },
    ongoing:   { label: 'Live Now',  color: '#10b981', bg: '#d1fae5' },
    completed: { label: 'Completed', color: '#64748b', bg: '#f1f5f9' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' }
};

const formatDateTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const toInputDateTime = (dt) => {
    if (!dt) return '';
    const d = new Date(dt);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const computeStatus = (m) => {
    if (m.status === 'cancelled') return 'cancelled';
    const now = Date.now();
    const start = new Date(m.scheduledAt).getTime();
    const end = start + m.duration * 60000;
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
};

const DEPARTMENTS = [
    { label: 'All', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'Sales', value: 'sales' },
    { label: 'Design', value: 'design' },
    { label: 'Procurement', value: 'procurement' },
    { label: 'Production & Site', value: 'production|engineer|site|supervisor|manager' },
    { label: 'Accounts', value: 'accounts' }
];

// ─── Schedule Modal ───────────────────────────────────────────────────────────
const ScheduleModal = ({ onClose, onSaved, editMeeting, allUsers }) => {
    const isEdit = !!editMeeting;
    const [form, setForm] = useState({
        title:       editMeeting?.title       || '',
        description: editMeeting?.description || '',
        meetLink:    editMeeting?.meetLink     || '',
        scheduledAt: toInputDateTime(editMeeting?.scheduledAt) || '',
        duration:    editMeeting?.duration    || 60,
        inviteeIds:  editMeeting?.invitees?.map(i => i.user._id || i.user) || []
    });
    const [search, setSearch]             = useState('');
    const [deptFilter, setDeptFilter]     = useState('all');
    const [saving, setSaving]             = useState(false);
    const [error, setError]               = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    // Guard: only parse if it looks like a valid ISO datetime string
    const isValidDT = form.scheduledAt && form.scheduledAt.includes('T') && !isNaN(new Date(form.scheduledAt).getTime());
    const selectedDate = isValidDT ? new Date(form.scheduledAt) : undefined;
    const timeValue    = isValidDT ? (form.scheduledAt.split('T')[1]?.slice(0, 5) || '') : '';

    const handleDaySelect = (day) => {
        if (!day) { setForm(p => ({ ...p, scheduledAt: '' })); return; }
        const pad = n => String(n).padStart(2, '0');
        // Use existing time or default to 09:00
        const parts = timeValue && timeValue.includes(':') ? timeValue.split(':') : ['09', '00'];
        const h = parts[0] || '09';
        const m = parts[1] || '00';
        setForm(p => ({
            ...p,
            scheduledAt: `${day.getFullYear()}-${pad(day.getMonth()+1)}-${pad(day.getDate())}T${h}:${m}`
        }));
        setShowCalendar(false);
    };

    const handleTimeChange = (e) => {
        const t = e.target.value;
        const today = new Date();
        const pad   = n => String(n).padStart(2, '0');
        const base  = isValidDT
            ? form.scheduledAt.split('T')[0]
            : `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
        setForm(p => ({ ...p, scheduledAt: `${base}T${t}` }));
    };

    const displayDate = selectedDate
        ? selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Pick a date';

    const filteredUsers = allUsers.filter(u => {
        const matchesSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                              u.role?.toLowerCase().includes(search.toLowerCase());
        
        if (!matchesSearch) return false;
        if (deptFilter === 'all') return true;

        const role = u.role?.toLowerCase() || '';
        const keywords = deptFilter.split('|');
        return keywords.some(kw => role.includes(kw));
    });

    const toggleInvitee = (id) => {
        setForm(prev => ({
            ...prev,
            inviteeIds: prev.inviteeIds.includes(id)
                ? prev.inviteeIds.filter(i => i !== id)
                : [...prev.inviteeIds, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.meetLink || !form.scheduledAt) {
            setError('Title, Meet Link, and Date/Time are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() };
            if (isEdit) {
                await meetingAPI.update(editMeeting._id, payload);
            } else {
                await meetingAPI.create(payload);
            }
            onSaved();
        } catch (err) {
            setError(err.message || 'Failed to save meeting.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="meeting-modal-overlay" onClick={onClose}>
            <div className="meeting-modal" onClick={e => e.stopPropagation()}>
                <div className="meeting-modal-header">
                    <h2>{isEdit ? 'Edit Meeting' : 'Schedule a Meeting'}</h2>
                    <button className="meeting-modal-close" onClick={onClose}><X size={20} /></button>
                </div>

                {error && <div className="meeting-modal-error"><AlertCircle size={16} />{error}</div>}

                <form onSubmit={handleSubmit} className="meeting-modal-body">
                    <div className="meeting-modal-grid">

                        {/* ── Left: Details ── */}
                        <div className="meeting-modal-section">
                            <h3>Meeting Details</h3>

                            <div className="meeting-field">
                                <label>Title *</label>
                                <input
                                    className="sdcn-input"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    placeholder="e.g. Weekly Sync"
                                    required
                                />
                            </div>

                            <div className="meeting-field">
                                <label>Description</label>
                                <textarea
                                    className="sdcn-input"
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    placeholder="Agenda or notes..."
                                    rows={2}
                                />
                            </div>

                            <div className="meeting-field">
                                <label>Google Meet Link *</label>
                                <div className="sdcn-input-icon">
                                    <Link2 size={15} />
                                    <input
                                        className="sdcn-input"
                                        value={form.meetLink}
                                        onChange={e => setForm(p => ({ ...p, meetLink: e.target.value }))}
                                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                        required
                                    />
                                </div>
                            </div>

                            {/* shadcn Calendar popover */}
                            <div className="meeting-field">
                                <label>Date *</label>
                                <div className="sdcn-popover-wrapper">
                                    <button
                                        type="button"
                                        className={`sdcn-date-trigger ${!selectedDate ? 'placeholder' : ''}`}
                                        onClick={() => setShowCalendar(v => !v)}
                                    >
                                        <Calendar size={15} />
                                        {displayDate}
                                    </button>
                                    {showCalendar && (
                                        <div className="sdcn-calendar-popover">
                                            <CalendarUI
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={handleDaySelect}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Time + Duration */}
                            <div className="meeting-field-row">
                                <div className="meeting-field">
                                    <label>Time *</label>
                                    <TimePicker
                                        value={timeValue}
                                        onChange={(t) => {
                                            const today = new Date();
                                            const pad   = n => String(n).padStart(2, '0');
                                            const base  = isValidDT
                                                ? form.scheduledAt.split('T')[0]
                                                : `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
                                            setForm(p => ({ ...p, scheduledAt: `${base}T${t}` }));
                                        }}
                                        required
                                    />
                                </div>
                                <div className="meeting-field">
                                    <label>Duration (mins)</label>
                                    <input
                                        type="number"
                                        className="sdcn-input"
                                        min={5}
                                        value={form.duration}
                                        onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Invitees ── */}
                        <div className="meeting-modal-section">
                            <h3>Invite Staff ({form.inviteeIds.length} selected)</h3>
                            
                            {/* Department Filter Tabs */}
                            <div className="meeting-dept-tabs">
                                {DEPARTMENTS.map(dept => (
                                    <button
                                        key={dept.value}
                                        type="button"
                                        className={`meeting-dept-tab ${deptFilter === dept.value ? 'active' : ''}`}
                                        onClick={() => setDeptFilter(dept.value)}
                                    >
                                        {dept.label}
                                    </button>
                                ))}
                            </div>

                            <div className="sdcn-search-wrap">
                                <Search size={14} />
                                <input
                                    className="sdcn-input"
                                    placeholder="Search by name or role..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="meeting-user-list">
                                {filteredUsers.map(u => {
                                    const selected = form.inviteeIds.includes(u._id);
                                    return (
                                        <div
                                            key={u._id}
                                            className={`meeting-user-item ${selected ? 'selected' : ''}`}
                                            onClick={() => toggleInvitee(u._id)}
                                        >
                                            <div className="meeting-user-avatar">
                                                {u.fullName?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div className="meeting-user-info">
                                                <span className="meeting-user-name">{u.fullName}</span>
                                                <span className="meeting-user-role">{u.role}</span>
                                            </div>
                                            {selected && <CheckCircle size={16} className="meeting-user-check" />}
                                        </div>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <p className="meeting-empty-search">No users found.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="meeting-modal-footer">
                        <button type="button" className="meeting-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="meeting-btn-primary" disabled={saving}>
                            {saving ? <><Loader size={16} className="spin" /> Saving...</> : isEdit ? 'Save Changes' : 'Schedule Meeting'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Meeting Card ─────────────────────────────────────────────────────────────
const MeetingCard = ({ meeting, onEdit, onCancel }) => {
    const status = computeStatus(meeting);
    const cfg = STATUS_CONFIG[status];

    return (
        <div className={`meeting-card ${status}`}>
            <div className="meeting-card-header">
                <div className="meeting-card-left">
                    <span className="meeting-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
                        {status === 'ongoing' && <span className="meeting-live-dot" />}
                        {cfg.label}
                    </span>
                    <h3 className="meeting-card-title">{meeting.title}</h3>
                    {meeting.description && <p className="meeting-card-desc">{meeting.description}</p>}
                </div>
                {status !== 'cancelled' && status !== 'completed' && (
                    <div className="meeting-card-actions">
                        <button className="meeting-icon-btn" title="Edit" onClick={() => onEdit(meeting)}>
                            <Edit2 size={15} />
                        </button>
                        <button className="meeting-icon-btn danger" title="Cancel" onClick={() => onCancel(meeting._id)}>
                            <XCircle size={15} />
                        </button>
                    </div>
                )}
            </div>

            <div className="meeting-card-meta">
                <span><Calendar size={14} />{formatDateTime(meeting.scheduledAt)}</span>
                <span><Clock size={14} />{meeting.duration} mins</span>
                <span><Users size={14} />{meeting.invitees?.length || 0} invitees</span>
            </div>

            <div className="meeting-card-footer">
                <div className="meeting-invitee-avatars">
                    {meeting.invitees?.slice(0, 5).map((inv, i) => (
                        <div key={i} className="meeting-avatar" title={inv.user?.fullName}>
                            {inv.user?.fullName?.charAt(0).toUpperCase() || '?'}
                        </div>
                    ))}
                    {meeting.invitees?.length > 5 && (
                        <div className="meeting-avatar more">+{meeting.invitees.length - 5}</div>
                    )}
                </div>
                {(status === 'upcoming' || status === 'ongoing') && (
                    <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`meeting-join-btn ${status === 'ongoing' ? 'live' : ''}`}
                    >
                        <Video size={15} />
                        {status === 'ongoing' ? 'Join Now' : 'Open Link'}
                    </a>
                )}
            </div>
        </div>
    );
};

// ─── Main Admin Meetings Page ─────────────────────────────────────────────────
const AdminMeetings = ({ user }) => {
    const [meetings, setMeetings] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMeeting, setEditMeeting] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [mRes, uRes] = await Promise.all([
                meetingAPI.getAll(),
                meetingAPI.getUsers()
            ]);
            setMeetings(mRes.data || []);
            setAllUsers(uRes.data || []);
        } catch (err) {
            console.error('Meetings fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Listen for navbar "Schedule Meeting" button
    useEffect(() => {
        const handler = () => setShowModal(true);
        window.addEventListener('open-schedule-meeting-modal', handler);
        return () => window.removeEventListener('open-schedule-meeting-modal', handler);
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this meeting?')) return;
        try {
            await meetingAPI.cancel(id);
            fetchData();
        } catch (err) {
            alert('Failed to cancel: ' + err.message);
        }
    };

    const handleEdit = (meeting) => {
        setEditMeeting(meeting);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditMeeting(null);
    };

    const handleSaved = () => {
        handleModalClose();
        fetchData();
    };

    const filtered = meetings.filter(m => {
        if (filter === 'all') return true;
        return computeStatus(m) === filter;
    });

    const stats = {
        total: meetings.length,
        upcoming: meetings.filter(m => computeStatus(m) === 'upcoming').length,
        ongoing: meetings.filter(m => computeStatus(m) === 'ongoing').length,
        completed: meetings.filter(m => computeStatus(m) === 'completed').length,
    };

    return (
        <div className="admin-meetings-page">
            {/* Stats */}
            <div className="meetings-stats-bar">
                {[
                    { label: 'Total', value: stats.total, color: '#6366f1' },
                    { label: 'Upcoming', value: stats.upcoming, color: '#3b82f6' },
                    { label: 'Live Now', value: stats.ongoing, color: '#10b981' },
                    { label: 'Completed', value: stats.completed, color: '#64748b' },
                ].map(s => (
                    <div key={s.label} className="meetings-stat-card">
                        <span className="meetings-stat-value" style={{ color: s.color }}>{s.value}</span>
                        <span className="meetings-stat-label">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="meetings-filters">
                {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map(f => (
                    <button
                        key={f}
                        className={`meetings-filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="meetings-loading"><Loader className="spin" size={28} /> Loading meetings...</div>
            ) : filtered.length === 0 ? (
                <div className="meetings-empty">
                    <Video size={48} />
                    <h3>No meetings found</h3>
                    <p>Schedule your first Google Meet session for your team.</p>
                    <button className="meeting-btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={16} /> Schedule Meeting
                    </button>
                </div>
            ) : (
                <div className="meetings-content">
                    {filter === 'all' ? (
                        <>
                            {filtered.filter(m => ['upcoming', 'ongoing'].includes(computeStatus(m))).length > 0 && (
                                <div className="meetings-section">
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>Upcoming & Live</h2>
                                    <div className="meetings-list">
                                        {filtered.filter(m => ['upcoming', 'ongoing'].includes(computeStatus(m))).map(m => (
                                            <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {filtered.filter(m => ['completed', 'cancelled'].includes(computeStatus(m))).length > 0 && (
                                <div className="meetings-section" style={{ marginTop: '32px' }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>Past Meetings</h2>
                                    <div className="meetings-list">
                                        {filtered.filter(m => ['completed', 'cancelled'].includes(computeStatus(m))).map(m => (
                                            <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="meetings-list">
                            {filtered.map(m => (
                                <MeetingCard
                                    key={m._id}
                                    meeting={m}
                                    onEdit={handleEdit}
                                    onCancel={handleCancel}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <ScheduleModal
                    onClose={handleModalClose}
                    onSaved={handleSaved}
                    editMeeting={editMeeting}
                    allUsers={allUsers}
                />
            )}
        </div>
    );
};

export default AdminMeetings;
