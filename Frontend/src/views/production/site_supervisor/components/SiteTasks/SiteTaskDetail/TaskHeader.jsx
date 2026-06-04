import React from 'react';

const STAGE_LABELS = { PM: 'Project Manager', PE: 'Project Engineer', SE: 'Site Engineer', SS: 'Site Supervisor' };
const PIPELINE = ['PM', 'PE', 'SE', 'SS'];

const getPriorityStyle = (p) => ({
    Low: { color: '#64748b', bg: '#f1f5f9' },
    Medium: { color: '#2563eb', bg: '#dbeafe' },
    High: { color: '#d97706', bg: '#fef3c7' },
    Urgent: { color: '#dc2626', bg: '#fee2e2' }
}[p] || { color: '#64748b', bg: '#f1f5f9' });

const getStatusStyle = (s) => ({
    'Pending': { label: '#92400e', bg: '#fef3c7' },
    'In Progress': { label: '#1e40af', bg: '#dbeafe' },
    'Completed': { label: '#065f46', bg: '#d1fae5' },
    'Approved': { label: '#5b21b6', bg: '#ede9fe' }
}[s] || { label: '#374151', bg: '#f3f4f6' });

const TaskHeader = ({ localTask, isOverdue }) => {
    const pr = getPriorityStyle(localTask.priority);
    const st = getStatusStyle(localTask.status);

    return (
        <div className="site-card" style={{ marginBottom: 20 }}>
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        {localTask.isSubtask && <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>↳ Subtask</div>}
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{localTask.title}</h2>
                        {localTask.description && <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{localTask.description}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className="site-badge" style={{ color: pr.color, background: pr.bg }}>{localTask.priority}</span>
                        <span className="site-badge" style={{ color: st.label, background: st.bg }}>{localTask.status}</span>
                        {isOverdue && <span className="site-badge" style={{ color: '#dc2626', background: '#fee2e2' }}>⚠ Overdue</span>}
                    </div>
                </div>
                <div className="site-pipeline">
                    {PIPELINE.map((s, i) => (
                        <React.Fragment key={s}>
                            <div className={`site-pipe-step${s === localTask.stage ? ' active' : ''}`}>
                                <div className="site-pipe-dot" /><span>{STAGE_LABELS[s]}</span>
                            </div>
                            {i < PIPELINE.length - 1 && <div className="site-pipe-line" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskHeader;
