import React from 'react';
import { Target, Truck, CheckCircle, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const OverviewStats = ({ pendingReviews, assignedRequests, completedRequests, extensionRequests, performanceData }) => {
    return (
        <div className="glass-stats-grid">
            <div className="glass-stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="glass-stat-value">{pendingReviews.length}</div>
                        <div className="glass-stat-label">Pending Reviews</div>
                    </div>
                    <div className="glass-stat-icon-wrapper icon-purple">
                        <Target size={20} strokeWidth={1.5} />
                    </div>
                </div>
                <div style={{ height: '40px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <Area type="monotone" dataKey="count" stroke="#a78bfa" fill="#f5f3ff" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="glass-stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="glass-stat-value">{assignedRequests.length}</div>
                        <div className="glass-stat-label">Active Assignments</div>
                    </div>
                    <div className="glass-stat-icon-wrapper icon-blue">
                        <Truck size={20} strokeWidth={1.5} />
                    </div>
                </div>
                <div style={{ height: '40px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData.map(d => ({ ...d, count: d.count * 0.8 }))}>
                            <Area type="monotone" dataKey="count" stroke="#60a5fa" fill="#eff6ff" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="glass-stat-value">{completedRequests.length}</div>
                        <div className="glass-stat-label">Completed Orders</div>
                    </div>
                    <div className="glass-stat-icon-wrapper icon-green">
                        <CheckCircle size={20} strokeWidth={1.5} />
                    </div>
                </div>
                <div style={{ height: '40px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData.map(d => ({ ...d, count: d.count * 1.2 }))}>
                            <Area type="monotone" dataKey="count" stroke="#34d399" fill="#f0fdf4" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="glass-stat-value">{extensionRequests.length}</div>
                        <div className="glass-stat-label">Time Extensions</div>
                    </div>
                    <div className="glass-stat-icon-wrapper icon-orange">
                        <AlertTriangle size={20} strokeWidth={1.5} />
                    </div>
                </div>
                <div style={{ height: '40px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData.map(d => ({ ...d, count: d.count * 0.5 }))}>
                            <Area type="monotone" dataKey="count" stroke="#fbbf24" fill="#fffbeb" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OverviewStats;
