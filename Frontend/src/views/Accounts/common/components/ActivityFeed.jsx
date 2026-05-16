import React from 'react';
import { Activity, Clock, FileText, IndianRupee, Wallet } from 'lucide-react';
import { Skeleton } from '../../components/UI/Skeleton';

const ActivityFeed = ({ loading, activityFeed, upcomingDues }) => {
    const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
    const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A';

    return (
        <div className="tables-grid-3">
            <div className="card-v3">
                <div className="card-header-v3"><h3><Activity size={16} /> Recent Activity</h3></div>
                <div className="activity-feed-list">
                    {loading ? <Skeleton width="100%" height="150px" /> : activityFeed.map((activity, i) => (
                        <div className="activity-item" key={i}>
                            <div className={`activity-icon ${activity.type?.toLowerCase()}`}>
                                {activity.type === 'Invoice' && <FileText size={14} />}
                                {activity.type === 'Payment' && <IndianRupee size={14} />}
                                {activity.type === 'Expense' && <Wallet size={14} />}
                            </div>
                            <div className="activity-content">
                                <h4 className="activity-title">{activity.title}</h4>
                                <div className="activity-meta">
                                    <span>{formatCurrency(activity.amount)}</span> • <span>{formatDate(activity.date)}</span>
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
                        <div className="due-item" key={i}>
                            <div className="due-info"><h4>{due.title}</h4><p>{due.entity}</p></div>
                            <div className="due-meta"><span className="due-amount">{formatCurrency(due.amount)}</span></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;
