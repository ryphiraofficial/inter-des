import React from 'react';
import { Clock, TrendingUp, CheckSquare, AlertCircle } from 'lucide-react';
import Skeleton from './Skeleton';

const SalesStatsGrid = ({ stats, pendingReviews, loading }) => {
    if (loading) {
        return (
            <div className="stats-grid">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="stat-card">
                        <Skeleton width="60px" height="60px" borderRadius="18px" />
                        <div className="stat-data" style={{ marginLeft: '1rem', flex: 1 }}>
                            <Skeleton width="40px" height="32px" />
                            <div style={{ height: '4px' }} />
                            <Skeleton width="80px" height="14px" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon pending">
                    <Clock size={28} />
                </div>
                <div className="stat-data">
                    <span className="value">{stats.pendingTasks}</span>
                    <span className="label">Pending Tasks</span>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon completed">
                    <TrendingUp size={28} />
                </div>
                <div className="stat-data">
                    <span className="value">{stats.completedToday}</span>
                    <span className="label">Done Today</span>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon projects">
                    <CheckSquare size={28} />
                </div>
                <div className="stat-data">
                    <span className="value">{stats.activeProjects}</span>
                    <span className="label">Active Projects</span>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon reviews">
                    <AlertCircle size={28} />
                </div>
                <div className="stat-data">
                    <span className="value">{pendingReviews.length}</span>
                    <span className="label">Pending Reviews</span>
                </div>
            </div>
        </div>
    );
};

export default SalesStatsGrid;
