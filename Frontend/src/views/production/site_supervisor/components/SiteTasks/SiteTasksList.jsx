import React from 'react';
import { Target, ChevronRight } from 'lucide-react';

const STAGE_LABELS = { PM: 'Project Manager', PE: 'Project Engineer', SE: 'Site Engineer', SS: 'Site Supervisor' };

const getPriorityStyle = (p) => ({
    Low: { color: '#64748b', bg: '#f1f5f9' },
    Medium: { color: '#2563eb', bg: '#dbeafe' },
    High: { color: '#d97706', bg: '#fef3c7' },
    Urgent: { color: '#dc2626', bg: '#fee2e2' }
}[p] || { color: '#64748b', bg: '#f1f5f9' });

const getStatusStyle = (s) => ({
    'Pending': { label: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
    'In Progress': { label: '#1e40af', bg: '#dbeafe', dot: '#3b82f6' },
    'Completed': { label: '#065f46', bg: '#d1fae5', dot: '#10b981' },
    'Approved': { label: '#5b21b6', bg: '#ede9fe', dot: '#8b5cf6' }
}[s] || { label: '#374151', bg: '#f3f4f6', dot: '#9ca3af' });

const SiteTasksList = ({ tasks, loading, openTask }) => {
    if (loading) return <div className="site-loading">Loading…</div>;

    if (tasks.length === 0) {
        return (
            <div className="site-card">
                <div className="site-empty" style={{ padding: 52 }}>
                    <Target size={40} />
                    <p>No tasks found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="site-task-cards">
            {tasks.map(task => {
                const pr = getPriorityStyle(task.priority);
                const st = getStatusStyle(task.status);
                const overdue = task.dueDate && new Date(task.dueDate) < new Date() && !['Completed', 'Approved'].includes(task.status);
                
                return (
                    <div key={task._id} className="site-task-card" onClick={() => openTask(task)}>
                        <div className="site-task-card-top">
                            <span className="site-badge" style={{ color: pr.color, background: pr.bg }}>{task.priority}</span>
                            <span className="site-badge" style={{ color: st.label, background: st.bg }}>{task.status}</span>
                            {overdue && <span className="site-badge" style={{ color: '#dc2626', background: '#fee2e2' }}>Overdue</span>}
                        </div>
                        <h3 className="site-task-card-title">{task.title}</h3>
                        {task.description && <p className="site-task-card-desc">{task.description}</p>}
                        <div className="site-task-card-meta">
                            <span>{task.projectId?.projectName || '—'}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{STAGE_LABELS[task.stage] || task.stage}</span>
                        </div>
                        <div className="site-task-card-footer">
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>By: {task.assignedBy?.fullName || '—'}</span>
                            {task.dueDate && <span style={{ fontSize: 12, color: overdue ? '#ef4444' : '#94a3b8', marginLeft: 'auto' }}>
                                {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>}
                            <ChevronRight size={13} style={{ color: '#94a3b8' }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SiteTasksList;
