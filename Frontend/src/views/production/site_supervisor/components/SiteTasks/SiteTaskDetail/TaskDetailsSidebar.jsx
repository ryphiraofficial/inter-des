import React from 'react';

const STAGE_LABELS = { PM: 'Project Manager', PE: 'Project Engineer', SE: 'Site Engineer', SS: 'Site Supervisor' };

const TaskDetailsSidebar = ({ localTask, user, supervisors, handleReassign, reassigning }) => {
    return (
        <div className="site-card">
            <div className="site-card-header"><div className="site-card-title">Details</div></div>
            <div className="site-info-rows">
                {[
                    ['Project', localTask.projectId?.projectName || '—'],
                    ['Assigned By', localTask.assignedBy?.fullName || '—'],
                    ['Assigned To', 'dropdown'],
                    ['Stage', STAGE_LABELS[localTask.stage] || localTask.stage],
                    ['Priority', localTask.priority],
                    ['Status', localTask.status],
                    ['Due', localTask.dueDate ? new Date(localTask.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—']
                ].map(([k, v]) => (
                    <div key={k} className="site-info-row">
                        <span className="site-info-label">{k}</span>
                        {v === 'dropdown' ? (
                            user?.role === 'Site Engineer' ? (
                                <select 
                                    className="site-input" 
                                    value={localTask.assignedTo?._id || localTask.assignedTo || ''}
                                    onChange={(e) => handleReassign(e.target.value)}
                                    disabled={reassigning}
                                    style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', width: 'auto', flex: 1, marginLeft: '10px' }}
                                >
                                    <option value="">Unassigned</option>
                                    {supervisors.map(m => (
                                        <option key={m._id} value={m._id}>{m.fullName} ({m.role})</option>
                                    ))}
                                </select>
                            ) : (
                                <span className="site-info-value">{localTask.assignedTo?.fullName || 'Unassigned'}</span>
                            )
                        ) : (
                            <span className="site-info-value">{v}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskDetailsSidebar;
