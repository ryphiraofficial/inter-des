import React from 'react';
import { Briefcase, Calendar, MessageSquare } from 'lucide-react';

const ApprovalTaskCard = ({ task, setPreviewTask, triggerAction }) => {
    const designerName = task.assignedTo?.map(s => s.name).join(', ') || 'Design Team';
    const designerInitials = designerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    return (
        <div className="st-task-card">
            <div className="st-task-card-header">
                <h3 className="st-task-title">{task.title}</h3>
                <span className={`st-priority-badge st-priority-${task.priority?.toLowerCase()}`}>
                    {task.priority || 'Medium'}
                </span>
            </div>
            
            <div className="st-task-card-meta">
                <div className="st-meta-item">
                    <Briefcase size={14} />
                    <span>{task.project?.projectName || task.quotation?.projectName || 'Interior Project'}</span>
                </div>
                <div className="st-meta-item">
                    <Calendar size={14} />
                    <span>Deadline: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>

            {task.submissions?.[task.submissions.length - 1]?.designerNotes && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#f8fafc', padding: '12px', borderRadius: '12px', marginTop: '4px' }}>
                    <MessageSquare size={14} style={{ marginTop: '2px', flexShrink: 0, color: '#6366f1' }} />
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.4' }}>
                        {task.submissions[task.submissions.length - 1].designerNotes}
                    </p>
                </div>
            )}

            <div className="designer-section" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto' }}>
                <div className="designer-avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', fontWeight: '600', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {designerInitials}
                </div>
                <div className="designer-name-details" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Designer</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{designerName}</span>
                </div>
            </div>

            <div className="st-task-card-footer" style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button 
                    className="st-btn-action approve"
                    style={{ background: '#f1f5f9', color: '#475569' }}
                    onClick={() => setPreviewTask(task)}
                >
                    Preview
                </button>
                <button 
                    className="st-btn-action reject"
                    onClick={() => triggerAction(task, 'reject')}
                >
                    Revise
                </button>
                <button 
                    className="st-btn-action approve"
                    onClick={() => triggerAction(task, 'approve')}
                >
                    Approve
                </button>
            </div>
        </div>
    );
};

export default ApprovalTaskCard;
