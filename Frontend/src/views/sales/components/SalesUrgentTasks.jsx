import React from 'react';
import { ChevronRight, ArrowRight, CheckSquare } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesUrgentTasks = ({ urgentTasks, loading, navigate }) => {
    return (
        <div className="tasks-card">
            <div className="section-header">
                <h2 className="section-title">Urgent Tasks</h2>
                {!loading && (
                    <button onClick={() => navigate('/staff/tasks')} className="view-all">
                        See All <ArrowRight size={14} />
                    </button>
                )}
            </div>
            <div className="tasks-list">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="task-item">
                            <Skeleton width="40px" height="40px" borderRadius="10px" />
                            <div className="task-info">
                                <Skeleton width="100px" height="14px" />
                                <div style={{ height: '6px' }} />
                                <Skeleton width="140px" height="10px" />
                            </div>
                        </div>
                    ))
                ) : urgentTasks.length > 0 ? (
                    urgentTasks.map((task) => (
                        <div key={task._id} className="task-item" onClick={() => navigate('/staff/tasks')}>
                            <div className={`task-priority-indicator ${task.priority?.toLowerCase()}`} />
                            <div className="task-info">
                                <h4 title={task.title}>{task.title}</h4>
                                <p>{task.client?.name || task.quotation?.projectName || 'No project assigned'}</p>
                            </div>
                            <ChevronRight size={16} className="task-chevron" />
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                        <CheckSquare size={24} color="#cbd5e1" />
                        <p>No urgent tasks!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesUrgentTasks;
