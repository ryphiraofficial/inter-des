import React from 'react';
import { Activity, Clock, FileText, IndianRupee, Wallet } from 'lucide-react';
import { Skeleton } from '../../components/UI/Skeleton';

const ActivityFeed = ({ loading, activityFeed, upcomingDues }) => {
    const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A';
    
    const getRelativeTime = (date) => {
        if (!date) return 'Just now';
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(date);
    };

    return (
        <div className="tables-grid-3">
            <div className="card-v3">
                <div className="card-header-v3"><h3><Activity size={16} /> Recent Activity</h3></div>
                <div className="activity-feed-list">
                    {loading ? <Skeleton width="100%" height="150px" /> : activityFeed.map((activity, i) => (
                        <div className="activity-item" key={i}>
                            <div className={`activity-icon ${activity.type?.toLowerCase() || 'default'}`}>
                                {activity.type === 'Invoice' ? <FileText size={14} /> : 
                                 activity.type === 'Payment' ? <IndianRupee size={14} /> : 
                                 <Wallet size={14} />}
                            </div>
                            <div className="activity-content">
                                <h4 className="activity-title">{activity.title}</h4>
                                <p className="activity-entity" style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px 0' }}>by System</p>
                                <div className="activity-meta">
                                    <span className="activity-amount" style={{ color: activity.type === 'Expense' ? '#ef4444' : '#10b981' }}>
                                        {activity.type === 'Expense' ? '-' : '+'}{formatCurrency(activity.amount)}
                                    </span>
                                    <span className="activity-time">{getRelativeTime(activity.date)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-v3">
                <div className="card-header-v3"><h3><Clock size={16} /> Upcoming Dues</h3></div>
                <div className="dues-list">
                    {loading ? <Skeleton width="100%" height="150px" /> : upcomingDues.map((due, i) => (
                        <div className={`due-item ${due.status === 'urgent' ? 'urgent' : due.status === 'warning' ? 'warning' : ''}`} key={i}>
                            <div className="due-info">
                                <h4>{due.title}</h4>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', flexShrink: 0 }}></span> {due.entity}</span>
                            </div>
                            <div className="due-meta">
                                <span className="due-amount">{formatCurrency(due.amount)}</span>
                                <span className={`due-date-badge ${due.status || 'normal'}`}>Due in {due.days || 3}d</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;
