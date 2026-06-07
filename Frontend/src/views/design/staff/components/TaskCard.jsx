import React from 'react';
import { Briefcase, Clock, Users, Palette, Upload, RefreshCw, MessageSquare } from 'lucide-react';

const isOverdue = (task) => {
    if (task.status === 'Completed' || task.status === 'Approved') return false;
    return task.dueDate && new Date(task.dueDate) < new Date();
};

const TaskCard = ({ 
    task, 
    user, 
    getPriorityColor, 
    onUpdateTaskStatus, 
    onOpenUpload, 
    setSelectedTask, 
    setShowDailyUpdateModal, 
    handleOpenComments 
}) => {
    const overdue = isOverdue(task);
    const isReassigned = task.timeline?.some(t => t.action === 'reassigned');
    const isSplit = task.assignedTo?.length > 1;
    const splitWith = task.assignedTo?.filter(s => s.email !== user?.email).map(s => s.name).join(', ');
    const projectName = task.quotation?.projectName || task.project?.projectName || 'Internal Assignment';

    return (
        <div className={`premium-task-card ${overdue ? 'overdue' : ''}`}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: getPriorityColor(task.priority), borderRadius: '20px 0 0 20px' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>{task.title}</strong>
                        {isReassigned && <span className="redo-badge">REASSIGNED</span>}
                        {isSplit && <span className="redo-badge" style={{ color: '#0ea5e9', background: '#f0f9ff', borderColor: '#bae6fd' }}>SPLIT</span>}
                        {overdue && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444', background: '#fee2e2', padding: '4px 10px', borderRadius: '8px' }}>OVERDUE</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f0f3ff', padding: '4px 10px', borderRadius: '8px' }}>
                            <Briefcase size={14} /> {projectName}
                        </div>
                        {task.quotation?.quotationNumber && (
                            <div style={{ background: '#eef2ff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
                                Quote: #{task.quotation.quotationNumber}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    <span style={{ color: task.status === 'Revision Required' ? '#ef4444' : '#64748b', background: task.status === 'Revision Required' ? '#fef2f2' : '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: task.status === 'Revision Required' ? '1px solid #fecaca' : '1px solid #e2e8f0' }}>
                        {task.status === 'Revision Required' ? 'Revision Required' : task.status}
                    </span>
                    {isSplit && splitWith && <span style={{ marginLeft: '10px', opacity: 0.8 }}><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {splitWith}</span>}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>

            {/* Progress */}
            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{
                    width: `${task.progress || 0}%`, height: '100%',
                    background: task.status === 'Revision Required' ? '#ef4444' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease-in-out'
                }}></div>
            </div>

            {/* Creative Brief / Requirements */}
            {task.creativeRequirements && (
                <div style={{ background: 'linear-gradient(to right, #f8fafc, #ffffff)', borderRadius: '14px', padding: '12px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' }}>
                        <Palette size={14} /> Design Brief
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{task.creativeRequirements}</p>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                    className="btn-glass-primary"
                    style={{ background: task.status === 'To Do' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #4f46e5, #6366f1)' }}
                    onClick={() => {
                        if (task.status === 'To Do') onUpdateTaskStatus(task._id, task.status);
                        onOpenUpload(task);
                    }}
                >
                    <Upload size={16} /> {task.status === 'To Do' ? 'Start Task' : 'Upload Design'}
                </button>
                <button
                    className="btn-glass-secondary"
                    onClick={() => { setSelectedTask(task); setShowDailyUpdateModal(true); }}
                    title="Daily Update"
                >
                    <RefreshCw size={16} />
                </button>
                <button
                    className="btn-glass-secondary"
                    onClick={() => handleOpenComments(task)}
                    title="Discussions"
                >
                    <MessageSquare size={16} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
