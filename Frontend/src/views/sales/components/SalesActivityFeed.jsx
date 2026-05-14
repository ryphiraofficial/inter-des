import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesActivityFeed = ({ recentVisits, urgentTasks, loading }) => {
    return (
        <div className="activity-card">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-feed">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="activity-item">
                            <Skeleton width="32px" height="32px" borderRadius="50%" />
                            <div className="activity-content" style={{ flex: 1 }}>
                                <Skeleton width="90%" height="12px" />
                                <div style={{ height: '6px' }} />
                                <Skeleton width="40%" height="10px" />
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {recentVisits.slice(0, 2).map((visit) => (
                            <div key={visit._id} className="activity-item">
                                <div className="activity-icon"><AlertCircle size={16} /></div>
                                <div className="activity-content">
                                    <p><strong>Site Visit</strong> logged for {visit.client?.name || 'Client'}</p>
                                    <span className="activity-time">{new Date(visit.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                        {urgentTasks.slice(0, 2).map((task) => (
                            <div key={task._id} className="activity-item">
                                <div className="activity-icon"><Clock size={16} /></div>
                                <div className="activity-content">
                                    <p><strong>Task Updated:</strong> {task.title}</p>
                                    <span className="activity-time">{new Date(task.updatedAt).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                        {recentVisits.length === 0 && urgentTasks.length === 0 && (
                            <div className="empty-state" style={{ padding: '1rem' }}>
                                <p style={{ color: '#94a3b8' }}>No recent activity.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SalesActivityFeed;
