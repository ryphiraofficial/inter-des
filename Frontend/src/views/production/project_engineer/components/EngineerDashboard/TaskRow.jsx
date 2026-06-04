import React from 'react';
import { ChevronRight } from 'lucide-react';

const getPriorityStyle = (p) => ({ Low: { color:'#64748b',bg:'#f1f5f9' }, Medium:{ color:'#2563eb',bg:'#dbeafe' }, High:{ color:'#d97706',bg:'#fef3c7' }, Urgent:{ color:'#dc2626',bg:'#fee2e2' } }[p] || { color:'#64748b',bg:'#f1f5f9' });
const getStatusStyle  = (s) => ({ 'Pending':{ dot:'#f59e0b',label:'#92400e',bg:'#fef3c7' }, 'In Progress':{ dot:'#3b82f6',label:'#1e40af',bg:'#dbeafe' }, 'Completed':{ dot:'#10b981',label:'#065f46',bg:'#d1fae5' }, 'Approved':{ dot:'#8b5cf6',label:'#5b21b6',bg:'#ede9fe' } }[s] || { dot:'#94a3b8',label:'#374151',bg:'#f3f4f6' });

export const TaskRow = ({ task, onClick }) => {
    const st = getStatusStyle(task.status);
    const pr = getPriorityStyle(task.priority);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !['Completed','Approved'].includes(task.status);
    return (
        <>
            {/* Desktop View */}
            <div className="eng-task-row eng-task-row-clickable desktop-only" onClick={onClick}>
                <div className="eng-task-dot" style={{ background: st.dot }} />
                <div className="eng-task-info">
                    <span className="eng-task-title">{task.title}</span>
                    <span className="eng-task-meta">
                        {task.projectId?.projectName || 'General'}
                        {task.dueDate && (
                            <span style={{ color: isOverdue ? '#ef4444' : '#94a3b8', marginLeft: 6 }}>
                                · Due {new Date(task.dueDate).toLocaleDateString('en-IN',{ day:'2-digit', month:'short' })}
                            </span>
                        )}
                    </span>
                </div>
                <div className="eng-task-badges">
                    <span className="eng-badge" style={{ color: pr.color, background: pr.bg }}>{task.priority}</span>
                    <span className="eng-badge" style={{ color: st.label, background: st.bg }}>{task.status}</span>
                </div>
                <ChevronRight size={14} style={{ color:'#94a3b8', flexShrink:0 }} />
            </div>

            {/* Mobile View */}
            <div className="eng-mobile-task-card mobile-only" onClick={onClick} style={{ margin: '0 16px 12px' }}>
                <div className="eng-mobile-task-header">
                    <div className="eng-mobile-task-title">{task.title}</div>
                    <ChevronRight size={14} style={{ color:'#94a3b8', flexShrink:0 }} />
                </div>
                <div className="eng-mobile-task-meta">
                    <span className="eng-badge" style={{ color: pr.color, background: pr.bg }}>{task.priority}</span>
                    <span className="eng-badge" style={{ color: st.label, background: st.bg }}>{task.status}</span>
                </div>
                <div className="eng-mobile-task-info">
                    <span>{task.projectId?.projectName || 'General'}</span>
                    {task.dueDate && (
                        <span style={{ color: isOverdue ? '#ef4444' : '#64748b' }}>
                            Due {new Date(task.dueDate).toLocaleDateString('en-IN',{ day:'2-digit', month:'short' })}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
};
