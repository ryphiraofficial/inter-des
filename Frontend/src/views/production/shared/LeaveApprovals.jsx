import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, CalendarOff, MessageSquare } from 'lucide-react';
import { leaveAPI } from '../../../models/api';
import './Shared.css';

const LeaveApprovals = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null);
    const [comments, setComments] = useState('');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await leaveAPI.getPendingLeaves();
            if (res.success) setLeaves(res.data);
        } catch (error) {
            console.error('Failed to fetch pending leaves', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            const res = await leaveAPI.updateLeaveStatus(id, { status, managerComments: comments });
            if (res.success) {
                setLeaves(prev => prev.filter(l => l._id !== id));
                setActionId(null);
                setComments('');
            }
        } catch (error) {
            console.error('Failed to update leave status', error);
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading pending leave requests...</div>;

    if (leaves.length === 0) return (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
            <CalendarOff size={40} style={{ color: '#94a3b8', margin: '0 auto 15px' }} />
            <h3 style={{ margin: '0 0 5px', color: '#334155', fontSize: 16 }}>All Caught Up!</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>There are no pending leave requests from your team.</p>
        </div>
    );

    return (
        <div style={{ display: 'grid', gap: 16 }}>
            {leaves.map(leave => (
                <div key={leave._id} className="eng-leave-card" style={{ padding: 20 }}>
                    <div className="eng-leave-card-top">
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                                <h4 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>{leave.user?.fullName}</h4>
                                <span className="eng-badge" style={{ background: '#f1f5f9', color: '#475569' }}>{leave.user?.role}</span>
                                <span className="eng-leave-type-chip">{leave.leaveType}</span>
                            </div>
                            <div className="eng-leave-card-dates">
                                <CalendarOff size={14} />
                                {format(new Date(leave.fromDate), 'dd MMM yyyy')}
                                {leave.toDate && new Date(leave.toDate).getTime() !== new Date(leave.fromDate).getTime() && (
                                    <> → {format(new Date(leave.toDate), 'dd MMM yyyy')}</>
                                )}
                                <span className="eng-leave-days">· {leave.days} day{leave.days > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Applied: {format(new Date(leave.createdAt), 'dd MMM')}</span>
                    </div>

                    <div className="eng-leave-reason" style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 10, borderLeft: '4px solid #cbd5e1' }}>
                        <strong>Reason:</strong> {leave.reason}
                    </div>

                    {actionId === leave._id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                            <textarea 
                                placeholder="Add optional comments for the applicant..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="eng-input"
                                style={{ minHeight: 80 }}
                            />
                            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                <button onClick={() => { setActionId(null); setComments(''); }} className="eng-btn-secondary">Cancel</button>
                                <button onClick={() => handleAction(leave._id, 'Rejected')} className="eng-btn-danger" style={{ background: '#fee2e2', color: '#991b1b', border: 'none' }}><XCircle size={15}/> Reject</button>
                                <button onClick={() => handleAction(leave._id, 'Approved')} className="eng-btn-primary"><CheckCircle2 size={15}/> Approve</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                            <button onClick={() => setActionId(leave._id)} className="eng-btn-primary" style={{ padding: '8px 20px' }}>
                                Review Request
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default LeaveApprovals;
