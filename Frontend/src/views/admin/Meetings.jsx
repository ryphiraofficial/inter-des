import React, { useState, useEffect } from 'react';
import { Video, Plus, Calendar, CheckCircle, Loader } from 'lucide-react';
import AlertDialog from './components/AlertDialog';
import 'react-day-picker/style.css';
import './css/Meetings.css';
import { computeStatus } from './utils/meetingUtils';
import ScheduleModal from './components/meetings/ScheduleModal';
import MeetingCard from './components/meetings/MeetingCard';
import { useAdminMeetings } from './hooks/useAdminMeetings';

// ─── Main Admin Meetings Page ─────────────────────────────────────────────────
const AdminMeetings = () => {
    const {
        allUsers,
        loading,
        showModal,
        editMeeting,
        filter,
        setFilter,
        meetingToCancel,
        setMeetingToCancel,
        isCancelling,
        handleCancel,
        handleConfirmCancel,
        handleEdit,
        handleModalClose,
        handleSaved,
        filtered,
        stats,
        createMeeting,
        updateMeeting
    } = useAdminMeetings();

    const [completedPage, setCompletedPage] = useState(1);
    const COMPLETED_PAGE_SIZE = 5;

    // Reset pagination when filter changes
    useEffect(() => {
        setCompletedPage(1);
    }, [filter]);

    const upcomingMeetings = filtered.filter(m => ['upcoming', 'ongoing'].includes(computeStatus(m)));
    const completedMeetings = filtered.filter(m => ['completed', 'cancelled'].includes(computeStatus(m)));
    
    const totalCompletedPages = Math.ceil(completedMeetings.length / COMPLETED_PAGE_SIZE);
    const paginatedCompleted = completedMeetings.slice((completedPage - 1) * COMPLETED_PAGE_SIZE, completedPage * COMPLETED_PAGE_SIZE);

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
                        <div className="meetings-two-col-layout">
                            {/* ── Upcoming & Live ── */}
                            <div className="meetings-shift-section">
                                <div className="meetings-shift-header upcoming-shift">
                                    <span className="shift-dot upcoming-dot" />
                                    <h2 className="shift-title">Upcoming & Live</h2>
                                    <span className="shift-count">{upcomingMeetings.length}</span>
                                </div>
                                {upcomingMeetings.length > 0 ? (
                                    <div className="meetings-list">
                                        {upcomingMeetings.map(m => (
                                            <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="meetings-shift-empty">
                                        <Calendar size={28} />
                                        <p>No upcoming meetings scheduled.</p>
                                    </div>
                                )}
                            </div>

                            {/* ── Completed ── */}
                            <div className="meetings-shift-section">
                                <div className="meetings-shift-header completed-shift">
                                    <span className="shift-dot completed-dot" />
                                    <h2 className="shift-title">Completed</h2>
                                    <span className="shift-count">{completedMeetings.length}</span>
                                </div>
                                {completedMeetings.length > 0 ? (
                                    <>
                                        <div className="meetings-list">
                                            {paginatedCompleted.map(m => (
                                                <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                            ))}
                                        </div>
                                        {totalCompletedPages > 1 && (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
                                                <button 
                                                    disabled={completedPage === 1} 
                                                    onClick={() => setCompletedPage(p => Math.max(1, p - 1))}
                                                    style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: completedPage === 1 ? '#f8fafc' : '#ffffff', color: completedPage === 1 ? '#94a3b8' : '#0f172a', cursor: completedPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '0.85rem' }}
                                                >
                                                    Previous
                                                </button>
                                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                                    Page {completedPage} of {totalCompletedPages}
                                                </span>
                                                <button 
                                                    disabled={completedPage === totalCompletedPages} 
                                                    onClick={() => setCompletedPage(p => Math.min(totalCompletedPages, p + 1))}
                                                    style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: completedPage === totalCompletedPages ? '#f8fafc' : '#ffffff', color: completedPage === totalCompletedPages ? '#94a3b8' : '#0f172a', cursor: completedPage === totalCompletedPages ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '0.85rem' }}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="meetings-shift-empty">
                                        <CheckCircle size={28} />
                                        <p>No completed meetings yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : filter === 'completed' || filter === 'cancelled' ? (
                        <>
                            <div className="meetings-list">
                                {paginatedCompleted.map(m => (
                                    <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                ))}
                            </div>
                            {totalCompletedPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
                                    <button disabled={completedPage === 1} onClick={() => setCompletedPage(p => Math.max(1, p - 1))} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: completedPage === 1 ? '#f8fafc' : '#ffffff', color: completedPage === 1 ? '#94a3b8' : '#0f172a', cursor: completedPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>Previous</button>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Page {completedPage} of {totalCompletedPages}</span>
                                    <button disabled={completedPage === totalCompletedPages} onClick={() => setCompletedPage(p => Math.min(totalCompletedPages, p + 1))} style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: completedPage === totalCompletedPages ? '#f8fafc' : '#ffffff', color: completedPage === totalCompletedPages ? '#94a3b8' : '#0f172a', cursor: completedPage === totalCompletedPages ? 'not-allowed' : 'pointer', fontWeight: 500, fontSize: '0.85rem' }}>Next</button>
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

            {showModal && (
                <ScheduleModal
                    onClose={handleModalClose}
                    onSaved={handleSaved}
                    editMeeting={editMeeting}
                    allUsers={allUsers}
                    createMeeting={createMeeting}
                    updateMeeting={updateMeeting}
                />
            )}

            <AlertDialog 
                isOpen={!!meetingToCancel}
                onClose={() => setMeetingToCancel(null)}
                onConfirm={handleConfirmCancel}
                title="Cancel Meeting"
                description={`Are you sure you want to cancel the meeting "${meetingToCancel?.title}"? This action will notify all invitees and cannot be undone.`}
                confirmText="Cancel Meeting"
                isProcessing={isCancelling}
            />
        </div>
    );
};

export default AdminMeetings;
