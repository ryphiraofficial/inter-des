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
        <div className={`premium-task-card ${overdue ? 'overdue' : ''}`} style={{
            position: 'relative',
            background: 'white',
            border: overdue ? '1px solid #fee2e2' : '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: getPriorityColor(task.priority), borderRadius: '20px 0 0 20px' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>{task.title}</strong>
                        {isReassigned && <span style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #ffedd5', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>REASSIGNED</span>}
                        {isSplit && <span style={{ background: '#f0f9ff', color: '#0284c7', border: '1px solid #e0f2fe', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>SPLIT</span>}
                        {overdue && <span style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>OVERDUE</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f5f7ff', color: '#4f46e5', border: '1px solid #e0e7ff', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                            <Briefcase size={12} /> {projectName}
                        </div>
                        {task.quotation?.quotationNumber && (
                            <div style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                Quote: #{task.quotation.quotationNumber}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                    <span style={{ 
                        color: task.status === 'Revision Required' ? '#dc2626' : '#475569', 
                        background: task.status === 'Revision Required' ? '#fef2f2' : '#f8fafc', 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        border: task.status === 'Revision Required' ? '1px solid #fee2e2' : '1px solid #e2e8f0',
                        fontWeight: 700
                    }}>
                        {task.status === 'Revision Required' ? 'Revision Required' : task.status}
                    </span>
                    {isSplit && splitWith && <span style={{ marginLeft: '10px', color: '#64748b', fontSize: '0.78rem' }}><Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {splitWith}</span>}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                    <span>Progress</span>
                    <span>{task.progress || 0}%</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${task.progress || 0}%`, height: '100%',
                        background: task.status === 'Revision Required' ? '#ef4444' : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease-in-out'
                    }}></div>
                </div>
            </div>

            {/* Creative Brief / Requirements */}
            {task.creativeRequirements && (
                <div style={{ 
                    background: 'linear-gradient(to right, #f8fafc, #ffffff)', 
                    borderRadius: '16px', 
                    padding: '12px 14px', 
                    marginBottom: '16px', 
                    border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #4f46e5'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Palette size={14} /> Design Brief
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontWeight: 500 }}>{task.creativeRequirements}</p>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '10px' }}>
                <button
                    className="btn-glass-primary"
                    style={{ 
                        flex: 1,
                        background: task.status === 'To Do' ? 'linear-gradient(135deg, #1e293b, #334155)' : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                        border: 'none',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)',
                        transition: 'transform 0.2s'
                    }}
                    onClick={() => {
                        if (task.status === 'To Do') onUpdateTaskStatus(task._id, task.status);
                        onOpenUpload(task);
                    }}
                >
                    <Upload size={16} /> {task.status === 'To Do' ? 'Start Task' : 'Upload Design'}
                </button>
                <button
                    className="btn-glass-secondary"
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onClick={() => { setSelectedTask(task); setShowDailyUpdateModal(true); }}
                    title="Daily Update"
                >
                    <RefreshCw size={16} />
                </button>
                <button
                    className="btn-glass-secondary"
                    style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#64748b',
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
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
