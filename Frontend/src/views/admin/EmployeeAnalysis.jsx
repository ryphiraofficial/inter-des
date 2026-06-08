import React, { useMemo, useState } from 'react';
import { Award, BarChart2, Eye, ShieldCheck, TrendingUp } from 'lucide-react';
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
        return analytics
            .filter((staff) => roleFilter === 'all' || staff.role === roleFilter)
            .filter((staff) => bandFilter === 'all' || staff.eligibilityBand === bandFilter)
            .sort((a, b) => Number(b.rewardScore || 0) - Number(a.rewardScore || 0));
    }, [analytics, roleFilter, bandFilter]);

    const handleViewBreakdown = async (staff) => {
        setSelectedAnalytics(null);
        setAnalyticsLoading(true);
        setShowAnalytics(true);
        try {
            const response = await dispatch(adminApi.endpoints.getStaffAnalytics.initiate(staff._id)).unwrap();
            if (response.success) setSelectedAnalytics(response.data);
        } catch (err) {
            showToast('Failed to load employee analysis', 'error');
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
            <div className="employee-analysis-hero">
                <div>
                    <span className="employee-analysis-kicker"><ShieldCheck size={16} /> Fair Reward System</span>
                    <h2>Employee Analysis</h2>
                    <p>Monitor hike and reward eligibility with role-wise comparison, weighted scores, and visible evidence.</p>
                </div>
                <div className="employee-analysis-hero-score">
                    <Award size={22} />
                    <strong>{analytics.filter((staff) => Number(staff.rewardScore || 0) >= 80).length}</strong>
                    <span>reward eligible</span>
                </div>
            </div>

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

                {error ? (
                    <div className="employee-analysis-empty">Unable to load employee analysis right now.</div>
                ) : isLoading ? (
                    <div className="employee-analysis-empty">Loading employee analysis...</div>
                ) : filteredAnalytics.length === 0 ? (
                    <div className="employee-analysis-empty">No employees match the selected filters.</div>
                ) : (
                    <div className="employee-analysis-table-wrap">
                        <table className="employee-analysis-table">
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Role</th>
                                    <th>Score</th>
                                    <th>Band</th>
                                    <th>Hike</th>
                                    <th>Evidence</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnalytics.map((staff) => (
                                    <tr key={staff._id}>
                                        <td>
                                            <div className="analysis-employee-cell">
                                                <div className="analysis-avatar">{(staff.name || staff.staffName || 'E').charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <strong>{staff.name || staff.staffName}</strong>
                                                    <span>{staff.status || 'Active'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{staff.role}</td>
                                        <td>
                                            <span className={`analysis-score ${getScoreClass(Number(staff.rewardScore || 0))}`}>
                                                {staff.rewardScore || 0}/100
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`analysis-band ${staff.eligibilityTone || 'watch'}`}>
                                                {staff.eligibilityBand || 'Not Rated'}
                                            </span>
                                        </td>
                                        <td>{staff.hikeRecommendation || 'Review'}</td>
                                        <td>
                                            <div className="analysis-evidence-mini">
                                                <span>{staff.tasksCompleted || 0}/{staff.totalTasksAssigned || 0} tasks</span>
                                                <span>{staff.onTimeCompletionRate || 0}% on time</span>
                                            </div>
                                        </td>
                                        <td>
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
