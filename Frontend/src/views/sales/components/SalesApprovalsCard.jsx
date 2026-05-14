import React from 'react';
import { FileText, ArrowRight, Eye, CheckSquare } from 'lucide-react';
import Skeleton from './Skeleton';
import { taskAPI } from '../../../models/api';

const SalesApprovalsCard = ({ pendingReviews, loading, navigate, onPreviewTask }) => {
    return (
        <div className="approvals-card">
            <div className="section-header">
                <h2 className="section-title">
                    <FileText size={20} color="#6366f1" />
                    {loading ? <Skeleton width="180px" height="24px" /> : `Pending Client Approvals (${pendingReviews.length})`}
                </h2>
                {!loading && (
                    <button onClick={() => navigate('/staff/tasks')} className="view-all">
                        View All <ArrowRight size={14} />
                    </button>
                )}
            </div>
            
            <div className="approvals-list">
                {loading ? (
                    <div className="approval-item">
                        <div style={{ flex: 1 }}>
                            <Skeleton width="140px" height="20px" />
                            <div style={{ height: '8px' }} />
                            <Skeleton width="100px" height="14px" />
                        </div>
                        <Skeleton width="90px" height="36px" borderRadius="20px" />
                    </div>
                ) : pendingReviews.length > 0 ? (
                    pendingReviews.map((task) => (
                        <div key={task._id} className="approval-item">
                            <div className="approval-info">
                                <h3>{task.title} <span className="approval-badge">REVIEW READY</span></h3>
                                <p>Project: {task.project?.projectName || task.quotation?.projectName || 'Interior Design Project'}</p>
                                <span>Assigned to: {task.assignedTo?.map(s => s.name).join(', ') || 'N/A'}</span>
                            </div>
                            <div className="approval-actions">
                                <button 
                                    className="btn-pill-ghost"
                                    onClick={() => onPreviewTask(task)}
                                >
                                    <Eye size={16} /> Preview
                                </button>
                                <button 
                                    className="btn-pill-solid"
                                    onClick={async () => {
                                        const notes = prompt('Add optional notes for the Design Manager:');
                                        try {
                                            const res = await taskAPI.salesApprove(task._id, { approved: true, salesNotes: notes || '' });
                                            if (res.success) {
                                                alert('✅ Design approved and forwarded!');
                                                window.location.reload();
                                            }
                                        } catch (err) { alert('Approval failed'); }
                                    }}
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <CheckSquare size={32} color="#cbd5e1" />
                        <p>All caught up! No designs pending your review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesApprovalsCard;
