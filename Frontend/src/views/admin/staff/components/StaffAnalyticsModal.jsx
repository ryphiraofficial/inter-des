import React from 'react';
import { X, BarChart2, CheckCircle, TrendingUp, Clock, AlertCircle, Briefcase } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

const StaffAnalyticsModal = ({ show, setShow, analyticsLoading, selectedAnalytics }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content analytics-modal">
                <div className="modal-header">
                    <div className="header-title"><BarChart2 size={24} /><h3>Staff Performance Analytics</h3></div>
                    <button className="modal-close" onClick={() => setShow(false)}><X size={20} /></button>
                </div>
                <div className="modal-body">
                    {analyticsLoading ? (
                        <div className="analytics-skeleton">
                            <Skeleton width="100%" height="200px" borderRadius="16px" />
                        </div>
                    ) : selectedAnalytics ? (
                        <div className="analytics-grid">
                            <div className="analytics-card main">
                                <div className="staff-overview">
                                    <div className="staff-avatar large">{selectedAnalytics.staffName.charAt(0).toUpperCase()}</div>
                                    <div className="staff-info"><h4>{selectedAnalytics.staffName}</h4><span>{selectedAnalytics.role}</span></div>
                                </div>
                                <div className="performance-score"><div className="circular-progress"><span className="score">{selectedAnalytics.performanceScore}%</span><span className="label">Completion Rate</span></div></div>
                            </div>
                            <div className="analytics-stats-grid">
                                <div className="stat-card"><div className="stat-icon completions"><CheckCircle size={20} /></div><div className="stat-info"><span className="stat-value">{selectedAnalytics.tasksCompleted}</span><span className="stat-label">Tasks Completed</span></div></div>
                                <div className="stat-card"><div className="stat-icon trend"><TrendingUp size={20} /></div><div className="stat-info"><span className="stat-value text-capitalize">{selectedAnalytics.efficiencyTrend}</span><span className="stat-label">Efficiency Trend</span></div></div>
                                <div className="stat-card"><div className="stat-icon on-time"><Clock size={20} /></div><div className="stat-info"><span className="stat-value">{selectedAnalytics.onTimeCompletionRate}%</span><span className="stat-label">On-Time Rate</span></div></div>
                                <div className="stat-card"><div className="stat-icon pending"><AlertCircle size={20} /></div><div className="stat-info"><span className="stat-value">{selectedAnalytics.pendingTasks}</span><span className="stat-label">Pending Tasks</span></div></div>
                            </div>
                            <div className="current-assignment">
                                <h5>Current Assignment</h5>
                                <div className="assignment-details">
                                    <div className="detail-item"><Briefcase size={16} /><div><label>Client</label><span>{selectedAnalytics.currentClient}</span></div></div>
                                    <div className="detail-item"><Briefcase size={16} /><div><label>Project</label><span>{selectedAnalytics.currentProject}</span></div></div>
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
