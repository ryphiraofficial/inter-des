import React from 'react';
import { Activity, Clock } from 'lucide-react';

const getActivityColor = (type) => {
    if (type?.includes('CREATE')) return '#3b82f6';
    if (type?.includes('UPDATE')) return '#f59e0b';
    if (type?.includes('APPROVE') || type?.includes('COMPLETED')) return '#10b981';
    if (type?.includes('COMMENT')) return '#8b5cf6';
    return '#64748b';
};

const RecentActivity = ({ recentActivity }) => {
    return (
        <div className="pm-card pm-activity-card">
            <div className="pm-card-header">
                <h3><Activity size={18} /> Recent Activity</h3>
            </div>
            <div className="pm-activity-timeline">
                {recentActivity.map((item, idx) => (
                    <div className="pm-timeline-item" key={item._id}>
                        <div className="pm-timeline-dot-wrapper">
                            <div className="pm-timeline-dot" style={{ background: getActivityColor(item.action) }}></div>
                            {idx < recentActivity.length - 1 && <div className="pm-timeline-line"></div>}
                        </div>
                        <div className="pm-timeline-content">
                            <div className="pm-timeline-header">
                                <div className="pm-timeline-avatar" style={{ background: getActivityColor(item.action) + '20', color: getActivityColor(item.action) }}>
                                    {item.userId?.fullName?.substring(0, 2).toUpperCase() || 'SY'}
                                </div>
                                <div className="pm-timeline-text">
                                    <span className="pm-timeline-user">{item.userId?.fullName || 'System'}</span>
                                    <span className="pm-timeline-action"> {item.action?.toLowerCase().replace(/_/g, ' ')}</span>
                                </div>
                            </div>
                            <p className="pm-timeline-detail">{item.message}</p>
                            <span className="pm-timeline-time"><Clock size={12} /> {new Date(item.timestamp || item.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
                {recentActivity.length === 0 && <p className="pm-empty-text" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No recent activity.</p>}
            </div>
        </div>
    );
};

export default RecentActivity;
