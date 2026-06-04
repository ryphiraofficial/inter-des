import React from 'react';
import { CheckSquare, Plus, Eye, Users, AlertTriangle } from 'lucide-react';

const PMDashboardSections = ({ tasks, getTaskTypeColor }) => {
    return (
        <div className="dashboard-sections">
            <div className="section-card">
                <div className="section-header">
                    <h3><CheckSquare size={18} /> Production Tasks</h3>
                    <button className="btn-add"><Plus size={14} /> Assign Task</button>
                </div>
                <div className="tasks-list">
                    {tasks.slice(0, 8).map(task => (
                        <div key={task._id} className={`task-item ${task.status?.toLowerCase().replace(' ', '-')}`}>
                            <div className={`status-dot ${task.status?.toLowerCase().replace(' ', '-')}`}></div>
                            <div className="task-info">
                                <span className="task-title">{task.title}</span>
                                <span className="task-meta">
                                    <span className="task-type" style={{ color: getTaskTypeColor(task.taskType) }}>
                                        {task.taskType || 'General'}
                                    </span>
                                    <span className="task-project">{task.project?.name}</span>
                                </span>
                            </div>
                            <div className="task-assignee">
                                <Users size={14} /> {task.assignedTo?.name || 'Unassigned'}
                            </div>
                            <div className="task-actions">
                                <button className="btn-icon" title="View"><Eye size={14} /></button>
                                <button className="btn-icon" title="Edit"><Plus size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-card">
                <div className="section-header">
                    <h3><AlertTriangle size={18} /> Issues Reported</h3>
                </div>
                <div className="issues-list">
                    {tasks.filter(t => t.status === 'Blocked').length > 0 ? (
                        tasks.filter(t => t.status === 'Blocked').map(task => (
                            <div key={task._id} className="issue-item">
                                <AlertTriangle size={16} className="issue-icon" />
                                <div className="issue-info">
                                    <span className="issue-title">{task.title}</span>
                                    <span className="issue-project">{task.project?.name}</span>
                                </div>
                                <button className="btn-resolve">Resolve</button>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state success">No issues reported</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PMDashboardSections;
