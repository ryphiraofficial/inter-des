import React from 'react';
import { Palette, Clock, AlertCircle, CheckCircle, Tag, Activity } from 'lucide-react';

// Pending reviews list panel
export const PendingReviewsPanel = ({ pendingReviews }) => (
    <div className="card-premium" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
        <div className="card-header" style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} color="#8b5cf6" /> Pending Manager Reviews
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Submissions awaiting your creative validation</p>
        </div>
        <div className="critical-list" style={{ display: 'grid', gap: '1rem' }}>
            {pendingReviews.length > 0 ? pendingReviews.slice(0, 4).map(task => (
                <div key={task._id} className="queue-item-premium" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '16px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        <Palette size={18} color="#8b5cf6" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned to {task.assignedTo?.map(s => s.name).join(', ')}</div>
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#8b5cf6', background: '#f5f3ff', padding: '4px 8px', borderRadius: '12px' }}>Review</div>
                </div>
            )) : (
                <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8', fontSize: '0.9rem' }}>No pending reviews</div>
            )}
        </div>
    </div>
);

const pipelineStatuses = ['Approved', 'Pending Sales Review', 'Sales Approved', 'Pending Admin Review'];

// Handoff pipeline panel
export const HandoffPipelinePanel = ({ tasks }) => {
    const pipelineTasks = (tasks || []).filter(t => pipelineStatuses.includes(t.status));
    return (
        <div className="card-premium" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
            <div className="card-header" style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} color="#6366f1" /> Handoff Pipeline
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Design progression through Sales & Admin</p>
            </div>
            <div className="critical-list" style={{ display: 'grid', gap: '1rem' }}>
                {pipelineTasks.length > 0 ? pipelineTasks.slice(0, 4).map(task => (
                    <div key={task._id} className="queue-item-premium" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '16px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            {task.status === 'Approved' ? <Tag size={18} color="#8b5cf6" /> :
                             task.status === 'Sales Approved' ? <CheckCircle size={18} color="#10b981" /> :
                             <Clock size={18} color="#6366f1" />}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{task.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Client: {task.project?.clientName || task.project?.projectName || task.quotation?.projectName || 'Private Client'}</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '10px', background: task.status === 'Sales Approved' ? '#dcfce7' : '#f1f5f9', borderRadius: '12px', color: task.status === 'Sales Approved' ? '#166534' : '#475569', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            {task.status === 'Sales Approved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {task.status}
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8', fontSize: '0.9rem' }}>No designs in pipeline</div>
                )}
            </div>
        </div>
    );
};
