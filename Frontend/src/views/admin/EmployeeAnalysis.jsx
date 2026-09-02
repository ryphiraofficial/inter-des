import React, { useMemo, useState } from 'react';
import { Award, BarChart2, Eye, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { adminApi, useGetStaffAnalyticsOverviewQuery } from '../../store/api/adminApi';
import { useToast } from '../../models/context/ToastContext';
import StaffRewardOverview from './staff/components/StaffRewardOverview';
import StaffAnalyticsModal from './staff/components/StaffAnalyticsModal';
import './css/Staff.css';
import './css/EmployeeAnalysis.css';

const bandOrder = ['Outstanding', 'Excellent', 'Good', 'Average', 'Needs Improvement'];

const EmployeeAnalysis = () => {
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const { data: analyticsOverview, isLoading, error } = useGetStaffAnalyticsOverviewQuery();
    
    const [roleFilter, setRoleFilter] = useState('all');
    const [bandFilter, setBandFilter] = useState('all');
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [selectedAnalytics, setSelectedAnalytics] = useState(null);

    const analytics = analyticsOverview?.data || [];
    const roles = useMemo(() => {
        return [...new Set(analytics.map((staff) => staff.role).filter(Boolean))].sort();
    }, [analytics]);

    const filteredAnalytics = useMemo(() => {
        return analytics.filter((staff) => {
            const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
            const matchesBand = bandFilter === 'all' || staff.performanceBand === bandFilter;
            return matchesRole && matchesBand;
        });
    }, [analytics, roleFilter, bandFilter]);

    const handleViewBreakdown = async (staff) => {
        setSelectedAnalytics({
            staffId: staff.staffId,
            name: staff.name,
            role: staff.role,
            performanceBand: staff.performanceBand,
            rewardScore: staff.rewardScore,
            hikeRecommendation: staff.hikeRecommendation,
            rewardRecommendation: staff.rewardRecommendation,
        });
        setShowAnalytics(true);
        setAnalyticsLoading(true);

        try {
            const result = await dispatch(adminApi.endpoints.getStaffDetailedAnalytics.initiate(staff.staffId, { forceRefetch: true })).unwrap();
            setSelectedAnalytics(result?.data || null);
        } catch (fetchError) {
            showToast(fetchError?.data?.message || 'Failed to fetch detailed analytics', 'error');
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const getScoreClass = (score) => {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'strong';
        if (score >= 70) return 'good';
        if (score >= 60) return 'watch';
        return 'risk';
    };

    return (
        <div className="employee-analysis-page">
            <StaffRewardOverview analytics={analytics} loading={isLoading} />

            <div className="analysis-rules-grid">
                <div className="analysis-rule-card">
                    <BarChart2 size={18} />
                    <h4>Weighted Score</h4>
                    <p>Delivery, quality, timeliness, ownership, consistency, and feedback create the final score.</p>
                </div>
                <div className="analysis-rule-card">
                    <TrendingUp size={18} />
                    <h4>Role Comparison</h4>
                    <p>Use role filters before final decisions so employees are compared with similar responsibilities.</p>
                </div>
                <div className="analysis-rule-card">
                    <ShieldCheck size={18} />
                    <h4>Evidence First</h4>
                    <p>Each recommendation includes task count, overdue work, revisions, and update coverage.</p>
                </div>
            </div>

            <section className="employee-analysis-table-section">
                <div className="employee-analysis-toolbar">
                    <div>
                        <h3>Hike & Reward Recommendations</h3>
                        <span>{filteredAnalytics.length} employees shown</span>
                    </div>
                    <div className="analysis-filters">
                        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter employees by role">
                            <option value="all">All roles</option>
                            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <select value={bandFilter} onChange={(event) => setBandFilter(event.target.value)} aria-label="Filter employees by performance band">
                            <option value="all">All bands</option>
                            {bandOrder.map((band) => <option key={band} value={band}>{band}</option>)}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="analysis-loading-state">Loading staff performance data...</div>
                ) : error ? (
                    <div className="analysis-error-state">Failed to load staff performance analysis.</div>
                ) : (
                    <div className="analysis-table-wrapper">
                        <table className="analysis-table">
                            <thead>
                                <tr>
                                    <th>Staff Member</th>
                                    <th>Role</th>
                                    <th>Weighted Score</th>
                                    <th>Performance Band</th>
                                    <th>Hike Recommendation</th>
                                    <th>Reward Action</th>
                                    <th>Key Evidence</th>
                                    <th className="action-col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnalytics.map((staff) => (
                                    <tr key={staff.staffId}>
                                        <td>
                                            <div className="staff-cell">
                                                <div className="staff-cell-avatar">
                                                    {staff.name?.charAt(0)?.toUpperCase() || 'S'}
                                                </div>
                                                <div>
                                                    <div className="staff-cell-name">{staff.name}</div>
                                                    <div className="staff-cell-sub">ID: {String(staff.staffId).slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="role-tag">{staff.role || 'Staff'}</span></td>
                                        <td>
                                            <span className={`score-badge ${getScoreClass(Number(staff.rewardScore || 0))}`}>
                                                {staff.rewardScore || 0}/100
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`band-pill band-${(staff.performanceBand || 'Good').toLowerCase().replace(/\s+/g, '-')}`}>
                                                {staff.performanceBand || 'Good'}
                                            </span>
                                        </td>
                                        <td><div className="hike-val">{staff.hikeRecommendation || 'Standard (5-7%)'}</div></td>
                                        <td><div className="reward-val">{staff.rewardRecommendation || 'None'}</div></td>
                                        <td>
                                            <div className="evidence-summary">
                                                <span>{staff.taskSummary?.completed || 0} tasks done</span>
                                                <span>{staff.taskSummary?.overdue || 0} overdue</span>
                                                <span>{staff.taskSummary?.revisions || 0} revisions</span>
                                            </div>
                                        </td>
                                        <td className="action-col">
                                            <button className="analysis-view-btn" onClick={() => handleViewBreakdown(staff)}>
                                                <Eye size={15} />
                                                <span>View Breakdown</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <StaffAnalyticsModal
                show={showAnalytics}
                setShow={setShowAnalytics}
                analyticsLoading={analyticsLoading}
                selectedAnalytics={selectedAnalytics}
            />
        </div>
    );
};

export default EmployeeAnalysis;
