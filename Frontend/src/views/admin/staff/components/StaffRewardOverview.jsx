import React, { useMemo, useState } from 'react';
import { Award, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import Skeleton from '../../components/Skeleton';
import CustomSelect from '../../components/CustomSelect';

const bandColors = {
    Outstanding: '#16a34a',
    Excellent: '#2563eb',
    Good: '#0891b2',
    Average: '#f59e0b',
    'Needs Improvement': '#dc2626'
};

const getAverage = (items, key) => {
    if (!items.length) return 0;
    return Math.round(items.reduce((sum, item) => sum + Number(item[key] || 0), 0) / items.length);
};

const StaffRewardOverview = ({ analytics = [], loading }) => {
    const roles = useMemo(() => {
        return [...new Set(analytics.map((staff) => staff.role).filter(Boolean))].sort();
    }, [analytics]);
    const [selectedRole, setSelectedRole] = useState('all');
    const visibleAnalytics = selectedRole === 'all'
        ? analytics
        : analytics.filter((staff) => staff.role === selectedRole);

    const rankedStaff = [...visibleAnalytics]
        .sort((a, b) => Number(b.rewardScore || 0) - Number(a.rewardScore || 0))
        .slice(0, 8)
        .map((staff) => ({
            name: staff.name || staff.staffName || 'Staff',
            score: Number(staff.rewardScore || 0),
            band: staff.eligibilityBand || 'Needs Improvement',
            role: staff.role || 'Staff'
        }));

    const rewardEligible = visibleAnalytics.filter((staff) => Number(staff.rewardScore || 0) >= 80).length;
    const hikeEligible = visibleAnalytics.filter((staff) => Number(staff.rewardScore || 0) >= 70).length;
    const needsReview = visibleAnalytics.filter((staff) => Number(staff.rewardScore || 0) < 60 && Number(staff.totalTasksAssigned || 0) > 0).length;
    const averageScore = getAverage(visibleAnalytics, 'rewardScore');

    if (loading) {
        return (
            <div className="staff-reward-overview">
                <Skeleton width="100%" height="280px" borderRadius="16px" />
            </div>
        );
    }

    if (!analytics.length) return null;

    return (
        <section className="staff-reward-overview" aria-label="Employee reward monitoring">
            <div className="reward-overview-header">
                <div>
                    <span className="section-kicker">Hike & Reward Monitor</span>
                    <h3>Employee Performance Scorecard</h3>
                </div>
                <div className="reward-header-actions">
                    <div style={{ width: '220px' }}>
                        <CustomSelect
                            options={[
                                { value: 'all', label: 'All roles' },
                                ...roles.map(role => ({ value: role, label: role }))
                            ]}
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            searchable={false}
                            variant="filter"
                        />
                    </div>
                    <div className="reward-average-pill">
                        <TrendingUp size={16} />
                        <span>{averageScore}/100 avg score</span>
                    </div>
                </div>
            </div>

            <div className="reward-overview-grid">
                <div className="reward-metric">
                    <div className="reward-metric-icon eligible"><Award size={18} /></div>
                    <div><strong>{rewardEligible}</strong><span>Reward eligible</span></div>
                </div>
                <div className="reward-metric">
                    <div className="reward-metric-icon hike"><TrendingUp size={18} /></div>
                    <div><strong>{hikeEligible}</strong><span>Hike eligible</span></div>
                </div>
                <div className="reward-metric">
                    <div className="reward-metric-icon team"><Users size={18} /></div>
                    <div><strong>{visibleAnalytics.length}</strong><span>Total employees</span></div>
                </div>
                <div className="reward-metric">
                    <div className="reward-metric-icon review"><AlertTriangle size={18} /></div>
                    <div><strong>{needsReview}</strong><span>Need review</span></div>
                </div>
            </div>

            <div className="reward-chart-panel">
                <div className="reward-chart-title">
                    <h4>Top performance scores</h4>
                    <span>{selectedRole === 'all' ? 'Use role filter for fair comparison' : `Compared within ${selectedRole}`}</span>
                </div>
                <div className="reward-chart">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={rankedStaff} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                formatter={(value) => [`${value}/100`, 'Reward score']}
                                labelFormatter={(label, payload) => {
                                    const item = payload?.[0]?.payload;
                                    return item ? `${label} - ${item.role}` : label;
                                }}
                            />
                            <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={34}>
                                {rankedStaff.map((entry) => (
                                    <Cell key={`${entry.name}-${entry.score}`} fill={bandColors[entry.band] || '#64748b'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
};

export default StaffRewardOverview;
