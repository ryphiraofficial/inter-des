import React from 'react';
import { Shield, Clock, CheckCircle, Briefcase, ArrowRight } from 'lucide-react';

const AdminApprovalColumn = ({ adminApproval, getApprovalTime, onSendToAdmin }) => {
    return (
        <div className="pipeline-column">
            <div className="col-header">
                <div className="col-title-box"><Shield size={18} /><span>Admin Approval</span></div>
                <span className="col-count" style={{ background: '#ede9fe', color: '#6d28d9' }}>{adminApproval.length}</span>
            </div>
            <div className="col-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Awaiting */}
                <div className="column-sub-section">
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={12} /> Awaiting Final Review
                    </p>
                    {adminApproval.filter(t => t.status !== 'Pushed to Procurement' && t.status !== 'Admin Approved').map(task => (
                        <div key={task._id} className="pipeline-card admin-card">
                            <div className="card-header">
                                <h4>{task.title}</h4>
                                <div className="approval-marker sales"><CheckCircle size={10} /><span>SALES APPROVED: {getApprovalTime(task, 'salesApproved')}</span></div>
                            </div>
                            <div className="card-info" style={{ marginTop: '10px' }}>
                                <p><Briefcase size={12} /> {task.project?.name || task.project?.projectName || task.quotation?.projectName || 'No Project'}</p>
                                {task.status === 'Pending Admin Review' && <div style={{ marginTop: '10px', padding: '8px', background: '#f5f3ff', color: '#6d28d9', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', border: '1px solid #ede9fe' }}>Under Review</div>}
                                {task.status === 'Admin Rejected' && <div style={{ marginTop: '10px', padding: '8px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', border: '1px solid #fee2e2' }}>Admin Requested Revision</div>}
                            </div>
                            {task.status === 'Sales Approved' && (
                                <div className="card-actions" style={{ marginTop: '15px' }}>
                                    <button className="card-btn admin-push" onClick={() => onSendToAdmin(task._id)}
                                        style={{ width: '100%', background: '#8b5cf6', color: 'white', border: 'none', padding: '10px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <ArrowRight size={14} /> Push to Admin
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {adminApproval.filter(t => t.status !== 'Pushed to Procurement' && t.status !== 'Admin Approved').length === 0 && (
                        <div className="empty-col" style={{ padding: '15px', fontSize: '0.8rem' }}>No designs pending admin</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminApprovalColumn;
