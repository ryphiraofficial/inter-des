import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesTasksGrid = ({ loading, filteredTasks, handleSalesReview, updatingTaskId }) => {
    return (
        <div className="st-tasks-grid">
            {loading ? (
                [...Array(6)].map((_, i) => (
                    <div key={i} className="st-task-card loading">
                        <Skeleton width="70%" height="20px" borderRadius="6px" />
                        <div style={{ height: '12px' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Skeleton width="40%" height="14px" />
                            <Skeleton width="40%" height="14px" />
                        </div>
                        <div style={{ height: '16px' }} />
                        <Skeleton width="100%" height="40px" borderRadius="8px" />
                        <div style={{ height: '20px' }} />
                        <Skeleton width="100%" height="30px" borderRadius="12px" />
                    </div>
                ))
            ) : filteredTasks.length === 0 ? (
                <div className="st-empty-state-card">
                    <p>No tasks found matching your criteria</p>
                </div>
            ) : filteredTasks.map(task => (
                <div key={task._id} className="st-task-card">
                    <div className="st-task-card-header">
                        <h3 className="st-task-title">{task.title}</h3>
                        <span className={`st-priority-badge st-priority-${task.priority?.toLowerCase()}`}>
                            {task.priority}
                        </span>
                    </div>
                    
                    <div className="st-task-card-meta">
                        <div className="st-meta-item">
                            <Briefcase size={14} />
                            <span>{task.quotation?.projectName || 'General'}</span>
                        </div>
                        <div className="st-meta-item">
                            <Calendar size={14} />
                            <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                    </div>

                    <p className="st-task-desc">
                        {task.description || 'No description provided.'}
                    </p>
                    
                    <div className="st-progress-cell">
                        <div className="st-progress-meta">
                            <span className="st-progress-label">Progress</span>
                            <span className="st-progress-text">{task.progress || 0}%</span>
                        </div>
                        <div className="st-progress-bar-bg">
                            <div
                                className="st-progress-bar-fill"
                                style={{ width: `${task.progress || 0}%` }}
                            />
                        </div>
                    </div>

                    <div className="st-task-card-footer">
                        {task.status === 'Pending Sales Review' ? (
                            <div className="st-review-actions">
                                <button 
                                    onClick={() => handleSalesReview(task._id, true)}
                                    disabled={updatingTaskId === task._id}
                                    className="st-btn-action approve"
                                >
                                    Approve
                                </button>
                                <button 
                                    onClick={() => handleSalesReview(task._id, false)}
                                    disabled={updatingTaskId === task._id}
                                    className="st-btn-action reject"
                                >
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <span className={`st-status-badge ${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                {task.status}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesTasksGrid;
