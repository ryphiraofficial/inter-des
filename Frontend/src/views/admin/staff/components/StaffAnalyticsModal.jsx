import React from 'react';
import { X, BarChart2, CheckCircle, TrendingUp, Clock, AlertCircle, Briefcase, Award } from 'lucide-react';
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

const scoreColors = ['#2563eb', '#16a34a', '#0891b2', '#f59e0b', '#7c3aed', '#64748b'];

const StaffAnalyticsModal = ({ show, setShow, analyticsLoading, selectedAnalytics }) => {
    if (!show) return null;

    const staffName = selectedAnalytics?.staffName || selectedAnalytics?.name || 'Staff';
    const rewardScore = Number(selectedAnalytics?.rewardScore ?? selectedAnalytics?.performanceScore ?? 0);
    const completionScore = Number(selectedAnalytics?.performanceScore || 0);
    const scoreBreakdown = selectedAnalytics?.scoreBreakdown || [
        { key: 'completion', label: 'Completion', score: completionScore, max: 100 }
    ];
    const circularProgress = `radial-gradient(closest-side, white 78%, transparent 79% 100%), conic-gradient(#2563eb ${rewardScore}%, #e2e8f0 0)`;

    return (
        <div className="staff-drawer-overlay" onClick={() => setShow(false)}>
            <div className="staff-drawer-content wide analytics-modal" onClick={e => e.stopPropagation()}>
                <div className="staff-drawer-header">
                    <div className="header-title"><BarChart2 size={24} /><h3>Staff Performance Analytics</h3></div>
                    <button className="modal-close" onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <div className="staff-drawer-body">
                    {analyticsLoading ? (
                        <div className="analytics-skeleton">
                            <Skeleton width="100%" height="200px" borderRadius="16px" />
                        </div>
                    ) : selectedAnalytics ? (
                        <div className="analytics-grid">
                            <div className="analytics-card main">
                                <div className="staff-overview">
                                    <div className="staff-avatar large">{staffName.charAt(0).toUpperCase()}</div>
                                    <div className="staff-info"><h4>{staffName}</h4><span>{selectedAnalytics.role}</span></div>
                                </div>
                                <div className="performance-score">
                                    <div className="circular-progress" style={{ background: circularProgress }}>
                                        <span className="score">{rewardScore}</span>
                                        <span className="label">Reward Score</span>
                                    </div>
                                </div>
                                <div className={`reward-band-pill ${selectedAnalytics.eligibilityTone || 'watch'}`}>
                                    <Award size={15} />
                                    <span>{selectedAnalytics.eligibilityBand || 'Not Rated'}</span>
                                </div>
                            </div>
                            <div className="analytics-stats-grid">
                                <div className="stat-card"><div className="stat-icon completions"><CheckCircle size={20} /></div><div className="stat-info"><span className="stat-value">{selectedAnalytics.tasksCompleted}</span><span className="stat-label">Tasks Completed</span></div></div>
                                <div className="stat-card"><div className="stat-icon trend"><TrendingUp size={20} /></div><div className="stat-info"><span className="stat-value text-capitalize">{selectedAnalytics.efficiencyTrend}</span><span className="stat-label">Efficiency Trend</span></div></div>
                                <div className="stat-card"><div className="stat-icon on-time"><Clock size={20} /></div><div className="stat-info"><span className="stat-value">{selectedAnalytics.onTimeCompletionRate}%</span><span className="stat-label">On-Time Rate</span></div></div>
                                <div className="stat-card"><div className="stat-icon pending"><AlertCircle size={20} /></div><div className="stat-info"><span className="stat-value">{selectedAnalytics.pendingTasks}</span><span className="stat-label">Pending Tasks</span></div></div>
                            </div>
                            <div className="reward-decision-card">
                                <div>
                                    <span>Hike Recommendation</span>
                                    <strong>{selectedAnalytics.hikeRecommendation || 'Review'}</strong>
                                </div>
                                <div>
                                    <span>Reward Decision</span>
                                    <strong>{selectedAnalytics.rewardDecision || 'Pending review'}</strong>
                                </div>
                                <div>
                                    <span>Reward Note</span>
                                    <strong>{selectedAnalytics.rewardRecommendation || 'No recommendation yet'}</strong>
                                </div>
                            </div>
                            <div className="score-breakdown-card">
                                <div className="score-breakdown-header">
                                    <h5>Score Breakdown</h5>
                                    <span>Weighted out of 100</span>
                                </div>
                                <ResponsiveContainer width="100%" height={230}>
                                    <BarChart data={scoreBreakdown} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
                                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                        <Tooltip formatter={(value, name, props) => [`${value}/${props?.payload?.max || 100}`, 'Score']} />
                                        <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={28}>
                                            {scoreBreakdown.map((entry, index) => (
                                                <Cell key={entry.key || entry.label} fill={scoreColors[index % scoreColors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="current-assignment">
                                <h5>Current Assignment</h5>
                                <div className="assignment-details">
                                    <div className="detail-item"><Briefcase size={16} /><div><label>Client</label><span>{selectedAnalytics.currentClient}</span></div></div>
                                    <div className="detail-item"><Briefcase size={16} /><div><label>Project</label><span>{selectedAnalytics.currentProject}</span></div></div>
                                </div>
                            </div>
                            <div className="analytics-evidence">
                                <h5>Evidence Used</h5>
                                <div className="evidence-grid">
                                    <span>Total tasks: <strong>{selectedAnalytics.totalTasksAssigned || 0}</strong></span>
                                    <span>Overdue: <strong>{selectedAnalytics.overdueTasks || 0}</strong></span>
                                    <span>Revisions: <strong>{selectedAnalytics.revisionCount || 0}</strong></span>
                                    <span>Daily update coverage: <strong>{selectedAnalytics.evidence?.dailyUpdateCoverage || 0}%</strong></span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state"><p>No analytics data available.</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffAnalyticsModal;
