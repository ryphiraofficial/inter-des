import React, { useState, useEffect } from 'react';
import { Video, Plus, Calendar, CheckCircle, Loader, CheckCheck, Clock } from 'lucide-react';
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
        setShowModal,
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
    const COMPLETED_PAGE_SIZE = 6;

    // Reset pagination when filter changes
    useEffect(() => {
        setCompletedPage(1);
    }, [filter]);

    const upcomingMeetings = filtered.filter(m => ['upcoming', 'ongoing'].includes(computeStatus(m)));
    const completedMeetings = filtered.filter(m => ['completed', 'cancelled'].includes(computeStatus(m)));
    
    const totalCompletedPages = Math.ceil(completedMeetings.length / COMPLETED_PAGE_SIZE);
    const paginatedCompleted = completedMeetings.slice((completedPage - 1) * COMPLETED_PAGE_SIZE, completedPage * COMPLETED_PAGE_SIZE);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {[
                    { label: 'Total Meetings', value: stats.total, color: '#2563eb' },
                    { label: 'Upcoming', value: stats.upcoming, color: '#3b82f6' },
                    { label: 'Live Now', value: stats.ongoing, color: '#10b981' },
                    { label: 'Completed', value: stats.completed, color: '#64748b' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        <span style={{ fontSize: '1.65rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filter Tabs & Schedule Action Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '6px',
                    display: 'inline-flex',
                    gap: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    flexWrap: 'wrap'
                }}>
                    {[
                        { key: 'all', label: 'Upcoming & Live' },
                        { key: 'upcoming', label: 'Upcoming' },
                        { key: 'ongoing', label: 'Live Now' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'cancelled', label: 'Cancelled' }
                    ].map(f => {
                        const isActive = filter === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                                    background: isActive ? '#eff6ff' : 'transparent',
                                    color: isActive ? '#2563eb' : '#64748b',
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: '0.84rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <Plus size={16} /> Schedule Meeting
                </button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <Loader className="spin" size={24} style={{ margin: '0 auto 8px', color: '#2563eb' }} />
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>Loading meetings...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        <Video size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
                        No Meetings Found
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                        Schedule your first Google Meet session for your team or clients.
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 18px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        <Plus size={16} /> Schedule Meeting
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Default Overview: Only One Section — Upcoming & Live */}
                    {filter === 'all' || filter === 'upcoming' || filter === 'ongoing' ? (
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                            {/* Section Header */}
                            <div style={{
                                padding: '1.1rem 1.25rem',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                        {filter === 'upcoming' ? 'Upcoming Meetings' : filter === 'ongoing' ? 'Live Meetings' : 'Upcoming & Live Meetings'}
                                    </h2>
                                    <span style={{
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '10px'
                                    }}>
                                        {upcomingMeetings.length}
                                    </span>
                                </div>
                            </div>

                            {/* Single View Content */}
                            {upcomingMeetings.length > 0 ? (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
                                    gap: '1rem',
                                    padding: '1.25rem'
                                }}>
                                    {upcomingMeetings.map(m => (
                                        <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    padding: '3.5rem 2rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#eff6ff',
                                        color: '#2563eb',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '0.85rem'
                                    }}>
                                        <Calendar size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                                        No Upcoming Meetings Scheduled
                                    </h3>
                                    <p style={{ color: '#64748b', fontSize: '0.825rem', maxWidth: '380px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                                        There are no upcoming or ongoing sessions right now. Use the button below to schedule one.
                                    </p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#2563eb',
                                            color: '#ffffff',
                                            fontWeight: 700,
                                            fontSize: '0.825rem',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                                        }}
                                    >
                                        <Plus size={15} /> Schedule Meeting
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Completed / Cancelled Filter Views */
                        <div style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{
                                padding: '1.1rem 1.25rem',
                                background: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: filter === 'cancelled' ? '#dc2626' : '#64748b', display: 'inline-block' }} />
                                    <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                        {filter === 'cancelled' ? 'Cancelled Meetings' : 'Completed Meetings'}
                                    </h2>
                                    <span style={{
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '10px'
                                    }}>
                                        {completedMeetings.length}
                                    </span>
                                </div>
                            </div>

                            {completedMeetings.length > 0 ? (
                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
                                        gap: '1rem'
                                    }}>
                                        {paginatedCompleted.map(m => (
                                            <MeetingCard key={m._id} meeting={m} onEdit={handleEdit} onCancel={handleCancel} />
                                        ))}
                                    </div>

                                    {totalCompletedPages > 1 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                            <button 
                                                disabled={completedPage === 1} 
                                                onClick={() => setCompletedPage(p => Math.max(1, p - 1))}
                                                style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: completedPage === 1 ? '#f8fafc' : '#ffffff', color: completedPage === 1 ? '#94a3b8' : '#0f172a', cursor: completedPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.825rem' }}
                                            >
                                                Previous
                                            </button>
                                            <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>
                                                Page {completedPage} of {totalCompletedPages}
                                            </span>
                                            <button 
                                                disabled={completedPage === totalCompletedPages} 
                                                onClick={() => setCompletedPage(p => Math.min(totalCompletedPages, p + 1))}
                                                style={{ padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: completedPage === totalCompletedPages ? '#f8fafc' : '#ffffff', color: completedPage === totalCompletedPages ? '#94a3b8' : '#0f172a', cursor: completedPage === totalCompletedPages ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.825rem' }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{
                                    padding: '3.5rem 2rem',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        background: '#f8fafc',
                                        color: '#94a3b8',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '0.85rem'
                                    }}>
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                                        {filter === 'cancelled' ? 'No Cancelled Meetings' : 'No Completed Meetings'}
                                    </h3>
                                    <p style={{ color: '#64748b', fontSize: '0.825rem', maxWidth: '380px', margin: 0 }}>
                                        {filter === 'cancelled' ? 'No meetings have been cancelled.' : 'Past completed meetings will appear here.'}
                                    </p>
                                </div>
                            )}
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
