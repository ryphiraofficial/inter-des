import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckSquare, Clock, CheckCircle2, AlertCircle,
    Flame, CalendarClock, TriangleAlert, Target,
    CloudRain, ClipboardCheck, FolderOpen, Zap
} from 'lucide-react';
import './Engineer.css';
import { useEngineerDashboard } from './hooks/useEngineerDashboard';
import Section from './components/EngineerDashboard/Section';
import { TaskRow } from './components/EngineerDashboard/TaskRow';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const EngineerDashboard = ({}) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const { data, loading, stats, doneRate } = useEngineerDashboard();

    const isSiteSupervisor = user?.role === 'Site Supervisor';

    const cards = [
        { label: 'Total Tasks', value: stats.total, icon: <CheckSquare size={20} />, gradient: 'linear-gradient(135deg,#818cf8,#6366f1)', shadow: 'rgba(99,102,241,0.25)' },
        { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)', shadow: 'rgba(245,158,11,0.25)' },
        { label: 'In Progress', value: stats.inProgress, icon: <AlertCircle size={20} />, gradient: 'linear-gradient(135deg,#60a5fa,#3b82f6)', shadow: 'rgba(59,130,246,0.25)' },
        { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={20} />, gradient: 'linear-gradient(135deg,#34d399,#10b981)', shadow: 'rgba(16,185,129,0.25)' },
    ];

    if (loading) return <div className="eng-dashboard"><div className="eng-loading">Loading dashboard…</div></div>;

    return (
        <div className="eng-dashboard">
            {/* Site Supervisor Specific Widgets */}
            {isSiteSupervisor && (
                <div className="ss-widgets-grid">
                    {/* Quick Actions */}
                    <div className="ss-widget-card">
                        <div className="ss-widget-header">
                            <h3 className="ss-widget-title"><Zap size={18} /> Quick Actions</h3>
                        </div>
                        <div className="ss-actions-grid">
                            <button className="ss-action-btn" onClick={() => navigate('/site/tasks')}>
                                <div className="ss-action-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}><CheckSquare size={20} /></div>
                                <span>Tasks</span>
                            </button>
                            <button className="ss-action-btn" onClick={() => navigate('/site/reports')}>
                                <div className="ss-action-icon" style={{ background: '#fef3c7', color: '#d97706' }}><ClipboardCheck size={20} /></div>
                                <span>Daily Report</span>
                            </button>
                            <button className="ss-action-btn" onClick={() => navigate('/site/projects')}>
                                <div className="ss-action-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}><FolderOpen size={20} /></div>
                                <span>Drawings</span>
                            </button>
                        </div>
                    </div>

                    {/* Weather Widget (Mock) */}
                    <div className="ss-widget-card ss-weather-widget">
                        <div className="ss-weather-info">
                            <CloudRain size={42} className="ss-weather-icon" />
                            <div>
                                <h3 className="ss-weather-temp">24°C</h3>
                                <p className="ss-weather-desc">Light Rain · Moderate Wind</p>
                            </div>
                        </div>
                        <div className="ss-weather-alert">
                            <TriangleAlert size={16} /> <span>Outdoor concreting not recommended today.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stat Cards */}
            <div className="eng-stats-grid">
                {cards.map(c => (
                    <div key={c.label} className="eng-stat-card" style={{ '--shadow-color': c.shadow }}>
                        <div className="eng-stat-icon" style={{ background: c.gradient }}>{c.icon}</div>
                        <div className="eng-stat-body">
                            <span className="eng-stat-value">{c.value}</span>
                            <span className="eng-stat-label">{c.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Three info sections */}
            <div className="eng-dash-grid">
                <Section icon={<Flame size={16} />} title="Overdue Tasks" accentColor="#ef4444" tasks={data?.overdue} empty="No overdue tasks — great work!" />
                <Section icon={<CalendarClock size={16} />} title="Due Today" accentColor="#f59e0b" tasks={data?.dueToday} empty="Nothing due today." />
                <Section icon={<TriangleAlert size={16} />} title="High Priority" accentColor="#d97706" tasks={data?.highPriority} empty="No high priority tasks." />
            </div>

            {/* Recent Activity Timeline */}
            <div className="eng-section-card" style={{ marginTop: 24 }}>
                <div className="eng-section-header">
                    <div className="eng-section-title"><CheckSquare size={18} />Activity Feed</div>
                    <button className="eng-see-all-btn" onClick={() => navigate('/engineer/tasks')}>View All</button>
                </div>
                {!data?.recentTasks?.length ? (
                    <div className="eng-empty"><Target size={36} /><p>No tasks assigned yet</p><span>Your Project Manager will assign tasks shortly.</span></div>
                ) : (
                    <div className="eng-task-list">
                        {data.recentTasks.map(t => (
                            <TaskRow key={t._id} task={t} onClick={() => navigate(`/engineer/tasks/${t._id}`)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineerDashboard;
