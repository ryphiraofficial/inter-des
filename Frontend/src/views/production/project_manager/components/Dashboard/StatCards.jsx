import React from 'react';
import { Target, CheckSquare, AlertCircle, CheckCircle, Users, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const StatCards = ({ data, teamWorkload, budgetPercent }) => {
    return (
        <div className="pm-stats-grid">
            {[
                { label: 'Total Projects', value: data.totalProjects, icon: Target, trend: 0, color: '#3b82f6', bg: '#eff6ff' },
                { label: 'Active Projects', value: data.activeProjects, icon: CheckSquare, trend: 0, color: '#16a34a', bg: '#dcfce7' },
                { label: 'Pending Approvals', value: data.pendingApprovals, icon: AlertCircle, trend: 0, color: '#d97706', bg: '#fef3c7' },
                { label: 'Completed Tasks', value: data.completedTasks, icon: CheckCircle, trend: 0, color: '#8b5cf6', bg: '#f3e8ff' },
                { label: 'Team Members', value: teamWorkload.length, icon: Users, trend: 0, color: '#0891b2', bg: '#cffafe' },
                { label: 'Budget Utilization', value: `${budgetPercent}%`, icon: Wallet, trend: 0, color: '#e11d48', bg: '#ffe4e6' },
            ].map((stat, idx) => (
                <div className="pm-stat-card-v2" key={idx}>
                    <div className="pm-stat-card-header">
                        <div className="pm-stat-icon-v2" style={{ background: stat.bg, color: stat.color }}>
                            <stat.icon size={20} />
                        </div>
                        <div className={`pm-stat-trend ${stat.trend >= 0 ? 'up' : 'down'}`} style={{ visibility: 'hidden' }}>
                            {stat.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {Math.abs(stat.trend)}%
                        </div>
                    </div>
                    <div className="pm-stat-value-v2">{stat.value}</div>
                    <div className="pm-stat-label-v2">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
