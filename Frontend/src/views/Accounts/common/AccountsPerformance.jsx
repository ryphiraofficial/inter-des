import React, { useState } from 'react';
import { 
    Award, TrendingUp, Zap, Percent, Clock, AlertCircle, 
    Sparkles, Trophy, Calendar, CheckCircle2, ChevronRight, User
} from 'lucide-react';
import { useGetAccountsPerformanceQuery } from '../../../store/api/accountsApi';
import { StatsSkeleton } from '../components/UI/Skeleton';
import '../css/AccountsPerformance.css';

const AccountsPerformance = ({ user }) => {
    const { data: res, isLoading, error, refetch } = useGetAccountsPerformanceQuery();
    const [viewMode, setViewMode] = useState('staff'); // 'staff' or 'manager'
    const [selectedStaffId, setSelectedStaffId] = useState(null);

    if (error) {
        return (
            <div className="perf-error-state">
                <AlertCircle size={48} className="error-icon" />
                <h3>Failed to Load Performance Analytics</h3>
                <p>{error?.data?.message || 'Please check your connection and try again.'}</p>
                <button onClick={() => refetch()} className="perf-retry-btn">Retry</button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="perf-loading-container">
                <StatsSkeleton count={4} />
                <div style={{ height: '300px', background: '#f8fafc', borderRadius: '16px', margin: '24px 0' }} />
            </div>
        );
    }

    const { staffPerformance = [], bestPerformer = null, managerPerformance = null } = res?.data || {};

    // Select the staff to show detailed KPIs for (default to first or logged-in staff member)
    const currentStaffId = selectedStaffId || (staffPerformance.find(s => s.id === user?._id)?.id) || staffPerformance[0]?.id;
    const activeStaff = staffPerformance.find(s => s.id === currentStaffId) || staffPerformance[0];

    const formatCurrency = (val) => {
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    return (
        <div className="perf-analytics-page fade-in">
            {/* View Selector Tabs */}
            <div className="perf-tabs-container">
                <button 
                    className={`perf-tab-btn ${viewMode === 'staff' ? 'active' : ''}`}
                    onClick={() => setViewMode('staff')}
                >
                    <User size={18} /> Staff Rankings & KPIs
                </button>
                <button 
                    className={`perf-tab-btn ${viewMode === 'manager' ? 'active' : ''}`}
                    onClick={() => setViewMode('manager')}
                >
                    <Trophy size={18} /> Manager Efficiency Hub
                </button>
            </div>

            {viewMode === 'staff' ? (
                <div className="perf-grid">
                    
                    {/* LEFT COLUMN: Leaderboard & Selector */}
                    <div className="perf-col-left">
                        {/* Best Performer Banner */}
                        {bestPerformer && (
                            <div className="best-performer-card">
                                <div className="crown-badge">🏆 Best Performer</div>
                                <div className="best-details">
                                    <div className="best-avatar">
                                        {bestPerformer.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h4>{bestPerformer.name}</h4>
                                        <p>{bestPerformer.role}</p>
                                    </div>
                                    <div className="best-score">
                                        <strong>{bestPerformer.overallScore}</strong>
                                        <span>/100</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leaderboard Rankings List */}
                        <div className="leaderboard-section">
                            <h3>Staff Leaderboard</h3>
                            <div className="leaderboard-list">
                                {staffPerformance.map((staff, index) => {
                                    const isSelected = staff.id === activeStaff?.id;
                                    let medal = null;
                                    if (index === 0) medal = '🥇';
                                    else if (index === 1) medal = '🥈';
                                    else if (index === 2) medal = '🥉';

                                    return (
                                        <div 
                                            key={staff.id}
                                            className={`leaderboard-item ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedStaffId(staff.id)}
                                        >
                                            <div className="rank-indicator">
                                                {medal ? <span className="medal">{medal}</span> : <span className="rank-num">{index + 1}</span>}
                                            </div>
                                            <div className="staff-info">
                                                <strong>{staff.name}</strong>
                                                <span>{staff.role}</span>
                                            </div>
                                            <div className="score-pill" style={{
                                                background: staff.overallScore >= 80 ? '#f0fdf4' : staff.overallScore >= 70 ? '#eff6ff' : '#fff7ed',
                                                color: staff.overallScore >= 80 ? '#15803d' : staff.overallScore >= 70 ? '#1d4ed8' : '#c2410c'
                                            }}>
                                                {staff.overallScore} pts
                                            </div>
                                            <ChevronRight size={16} className="chevron" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Selected Staff Details & KPIs */}
                    {activeStaff && (
                        <div className="perf-col-right">
                            <div className="staff-details-header">
                                <div className="staff-main-score">
                                    <div className="circle-score" style={{
                                        borderColor: activeStaff.overallScore >= 80 ? '#22c55e' : activeStaff.overallScore >= 70 ? '#3b82f6' : '#f97316'
                                    }}>
                                        <h2>{activeStaff.overallScore}</h2>
                                        <span>Overall Score</span>
                                    </div>
                                    <div className="score-meta">
                                        <h3>{activeStaff.name}</h3>
                                        <p>{activeStaff.role}</p>
                                        <span className="perf-tag">Period: Current Month</span>
                                    </div>
                                </div>

                                {/* AI Insights Card */}
                                <div className="ai-insights-banner">
                                    <div className="ai-title">
                                        <Sparkles size={16} /> Antigravity AI Insights
                                    </div>
                                    <p className="ai-text">"{activeStaff.aiInsights}"</p>
                                    {activeStaff.improvements && (
                                        <div className="ai-improvement">
                                            <strong>Key Action:</strong> {activeStaff.improvements}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* KPI Metrics Grid */}
                            <div className="metrics-grid">
                                <div className="metric-card">
                                    <div className="metric-header">
                                        <div className="metric-icon-wrap blue"><Percent size={18} /></div>
                                        <span>Collection Rate (40%)</span>
                                    </div>
                                    <h3>{activeStaff.collectionRate.toFixed(1)}%</h3>
                                    <div className="mini-progress-bar">
                                        <div className="fill blue" style={{ width: `${activeStaff.collectionRate}%` }} />
                                    </div>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-header">
                                        <div className="metric-icon-wrap green"><TrendingUp size={18} /></div>
                                        <span>Collection Amt (25%)</span>
                                    </div>
                                    <h3>{formatCurrency(activeStaff.totalCollectedAmount)}</h3>
                                    <span className="metric-subtext">Collected in total</span>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-header">
                                        <div className="metric-icon-wrap gold"><CheckCircle2 size={18} /></div>
                                        <span>Follow-ups (15%)</span>
                                    </div>
                                    <h3>{activeStaff.followUpRate.toFixed(1)}%</h3>
                                    <div className="mini-progress-bar">
                                        <div className="fill gold" style={{ width: `${activeStaff.followUpRate}%` }} />
                                    </div>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-header">
                                        <div className="metric-icon-wrap purple"><Zap size={18} /></div>
                                        <span>Accuracy (10%)</span>
                                    </div>
                                    <h3>{activeStaff.accuracyRate.toFixed(1)}%</h3>
                                    <span className="metric-subtext">Verified collections</span>
                                </div>

                                <div className="metric-card">
                                    <div className="metric-header">
                                        <div className="metric-icon-wrap orange"><Clock size={18} /></div>
                                        <span>Avg Days (10%)</span>
                                    </div>
                                    <h3>{activeStaff.avgDays.toFixed(1)} Days</h3>
                                    <span className="metric-subtext">Turnaround speed</span>
                                </div>
                            </div>

                            {/* Trend Chart (SVG Area Chart) */}
                            <div className="trend-chart-card">
                                <h3>Monthly Performance Trend</h3>
                                <div className="svg-chart-container">
                                    <svg viewBox="0 0 500 150" className="trend-svg">
                                        <defs>
                                            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                                            </linearGradient>
                                        </defs>
                                        {/* Points mapping */}
                                        <polyline
                                            fill="url(#trendGrad)"
                                            stroke="none"
                                            points="50,140 180,140 180,50 320,50 320,20 450,20 450,140"
                                        />
                                        <path
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="3.5"
                                            d={`M 50 ${140 - (activeStaff.trend[0]?.score || 70)} L 250 ${140 - (activeStaff.trend[1]?.score || 75)} L 450 ${140 - (activeStaff.trend[2]?.score || 80)}`}
                                        />
                                        {/* Circle dots */}
                                        <circle cx="50" cy={140 - (activeStaff.trend[0]?.score || 70)} r="5.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                                        <circle cx="250" cy={140 - (activeStaff.trend[1]?.score || 75)} r="5.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                                        <circle cx="450" cy={140 - (activeStaff.trend[2]?.score || 80)} r="5.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                                        
                                        {/* Labels */}
                                        <text x="50" y={140 - (activeStaff.trend[0]?.score || 70) - 12} textAnchor="middle" className="chart-label">{activeStaff.trend[0]?.score} pts</text>
                                        <text x="250" y={140 - (activeStaff.trend[1]?.score || 75) - 12} textAnchor="middle" className="chart-label">{activeStaff.trend[1]?.score} pts</text>
                                        <text x="450" y={140 - (activeStaff.trend[2]?.score || 80) - 12} textAnchor="middle" className="chart-label">{activeStaff.trend[2]?.score} pts</text>

                                        {/* X Axis labels */}
                                        <text x="50" y="145" textAnchor="middle" className="axis-label">{activeStaff.trend[0]?.month}</text>
                                        <text x="250" y="145" textAnchor="middle" className="axis-label">{activeStaff.trend[1]?.month}</text>
                                        <text x="450" y="145" textAnchor="middle" className="axis-label">{activeStaff.trend[2]?.month}</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* MANAGER PERFORMANCE VIEW */
                managerPerformance && (
                    <div className="perf-manager-container">
                        <div className="manager-hero">
                            <div className="manager-circle-score">
                                <h2>{managerPerformance.overallScore}</h2>
                                <span>Manager Rating</span>
                            </div>
                            <div className="manager-hero-info">
                                <h3>{managerPerformance.name}</h3>
                                <p>{managerPerformance.role}</p>
                                <div className="manager-ai-insights">
                                    <div className="ai-title"><Sparkles size={16} /> AI Executive Summary</div>
                                    <p>"{managerPerformance.aiInsights}"</p>
                                </div>
                            </div>
                        </div>

                        {/* Manager KPIs */}
                        <div className="metrics-grid" style={{ margin: '24px 0' }}>
                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon-wrap blue"><CheckCircle2 size={18} /></div>
                                    <span>Clearance Efficiency (35%)</span>
                                </div>
                                <h3>{managerPerformance.clearanceEfficiency.toFixed(1)}%</h3>
                                <span className="metric-subtext">Verified clearances</span>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon-wrap green"><TrendingUp size={18} /></div>
                                    <span>Team Performance (35%)</span>
                                </div>
                                <h3>{formatCurrency(managerPerformance.totalTeamCollections)}</h3>
                                <span className="metric-subtext">vs Target: {formatCurrency(managerPerformance.teamTarget)}</span>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon-wrap purple"><Percent size={18} /></div>
                                    <span>Recovery Rate (20%)</span>
                                </div>
                                <h3>{managerPerformance.recoveryRate.toFixed(1)}%</h3>
                                <span className="metric-subtext">Outstanding recovered</span>
                            </div>

                            <div className="metric-card">
                                <div className="metric-header">
                                    <div className="metric-icon-wrap gold"><Zap size={18} /></div>
                                    <span>Verification Accuracy (10%)</span>
                                </div>
                                <h3>{managerPerformance.verificationAccuracy.toFixed(1)}%</h3>
                                <span className="metric-subtext">Correct releases</span>
                            </div>
                        </div>

                        {/* Outstanding Recovery Analysis */}
                        <div className="perf-row-flex">
                            <div className="perf-summary-card">
                                <h3>Outstanding Balance Overview</h3>
                                <div className="summary-stat-box">
                                    <div className="stat-col">
                                        <span>Total Team Collections</span>
                                        <h4 className="text-green">{formatCurrency(managerPerformance.totalTeamCollections)}</h4>
                                    </div>
                                    <div className="stat-col">
                                        <span>Active Outstanding</span>
                                        <h4 className="text-orange">{formatCurrency(managerPerformance.outstandingAmount)}</h4>
                                    </div>
                                </div>
                                <div className="recovery-meter-bar">
                                    <div className="fill green" style={{ width: `${managerPerformance.recoveryRate}%` }} />
                                    <div className="fill orange" style={{ width: `${100 - managerPerformance.recoveryRate}%` }} />
                                </div>
                                <div className="recovery-labels">
                                    <span>Recovered ({managerPerformance.recoveryRate.toFixed(1)}%)</span>
                                    <span>Remaining Outstanding</span>
                                </div>
                            </div>

                            {/* Monthly Comparison */}
                            <div className="perf-summary-card">
                                <h3>Monthly Collections Growth</h3>
                                <div className="growth-bars">
                                    {managerPerformance.monthlyComparison.map(month => {
                                        const percent = (month.collections / managerPerformance.totalTeamCollections) * 100;
                                        return (
                                            <div key={month.month} className="growth-bar-col">
                                                <div className="bar-wrapper">
                                                    <div className="bar-fill" style={{ height: `${percent}%` }} />
                                                </div>
                                                <span className="month-name">{month.month}</span>
                                                <span className="month-val">{formatCurrency(month.collections)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default AccountsPerformance;
