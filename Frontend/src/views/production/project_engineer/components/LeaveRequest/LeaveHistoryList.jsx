import React from 'react';
import { CalendarOff, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_STYLE = {
    Pending:  { color: '#92400e', bg: '#fef3c7', icon: <Clock size={13}/> },
    Approved: { color: '#065f46', bg: '#d1fae5', icon: <CheckCircle2 size={13}/> },
    Rejected: { color: '#991b1b', bg: '#fee2e2', icon: <XCircle size={13}/> },
};

const LeaveHistoryList = ({ history }) => {
    return (
        <div className="eng-section-card">
            <div className="eng-section-header">
                <div className="eng-section-title"><Clock size={16}/> My Applications</div>
                <span className="eng-task-count">{history.length}</span>
            </div>

            {history.length === 0 ? (
                <div className="eng-empty" style={{ padding: '60px 24px' }}>
                    <CalendarOff size={36}/>
                    <p>No applications yet</p>
                    <span>Your submitted leave requests will appear here.</span>
                </div>
            ) : (
                <div style={{ padding: '8px 16px 20px' }}>
                    {history.map(h => {
                        const st = STATUS_STYLE[h.status] || STATUS_STYLE.Pending;
                        return (
                            <div key={h._id || h.id} className="eng-leave-card">
                                <div className="eng-leave-card-top">
                                    <span className="eng-leave-type-chip">{h.leaveType}</span>
                                    <span className="eng-badge" style={{ color: st.color, background: st.bg, display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {st.icon} {h.status}
                                    </span>
                                </div>
                                <div className="eng-leave-card-dates">
                                    <CalendarOff size={12}/>
                                    {format(new Date(h.fromDate),'dd MMM yyyy')}
                                    {h.toDate && h.toDate !== h.fromDate && (
                                        <> → {format(new Date(h.toDate),'dd MMM yyyy')}</>
                                    )}
                                    <span className="eng-leave-days">· {h.days} day{h.days > 1 ? 's' : ''}</span>
                                </div>
                                <p className="eng-leave-reason">{h.reason}</p>
                                {h.managerComments && (
                                    <div style={{ marginTop: 4, fontSize: 12, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9', color: '#475569' }}>
                                        <strong>Manager Note:</strong> {h.managerComments}
                                    </div>
                                )}
                                <span className="eng-leave-applied">
                                    Applied: {format(new Date(h.createdAt || h.appliedOn || Date.now()),'dd MMM yyyy')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default LeaveHistoryList;
