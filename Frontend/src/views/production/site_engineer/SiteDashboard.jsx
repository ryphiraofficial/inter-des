import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckSquare, Clock, CheckCircle2, AlertCircle,
    Flame, CalendarClock, TriangleAlert, Target, Briefcase
} from 'lucide-react';
import { useSiteDashboard } from './hooks/useSiteDashboard';
import './Site.css';

import TaskRow from './components/SiteDashboard/TaskRow';
import ProjectCard from './components/SiteDashboard/ProjectCard';
import Section from './components/SiteDashboard/Section';
import SiteSupervisorWidgets from './components/SiteDashboard/SiteSupervisorWidgets';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const SiteDashboard = ({}) => {
    const user = useAppSelector(selectUser);
    const navigate = useNavigate();
    const { data, loading, stats, doneRate, myProjects } = useSiteDashboard();

    const cards = [
        { label: 'Total', value: stats.total, gradient: 'linear-gradient(135deg,#818cf8,#6366f1)', shadow: 'rgba(99,102,241,0.25)', icon: <CheckSquare size={20} /> },
        { label: 'Pending', value: stats.pending, gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)', shadow: 'rgba(245,158,11,0.25)', icon: <Clock size={20} /> },
        { label: 'In Progress', value: stats.inProgress, gradient: 'linear-gradient(135deg,#34d399,#10b981)', shadow: 'rgba(16,185,129,0.25)', icon: <AlertCircle size={20} /> },
        { label: 'Completed', value: stats.completed, gradient: 'linear-gradient(135deg,#a78bfa,#8b5cf6)', shadow: 'rgba(139,92,246,0.25)', icon: <CheckCircle2 size={20} /> },
    ];

    if (loading) return <div className="site-page"><div className="site-loading">Loading dashboard…</div></div>;

    return (
        <div className="site-page">
            <div className="site-stats-grid">
                {cards.map(c => (
                    <div key={c.label} className="site-stat-card" style={{ '--site-shadow': c.shadow }}>
                        <div className="site-stat-icon" style={{ background: c.gradient }}>
                            {c.icon}
                        </div>
                        <div>
                            <div className="site-stat-value">{c.value}</div>
                            <div className="site-stat-label">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {myProjects.length > 0 && (
                <div className="site-card" style={{ marginBottom: 20 }}>
                    <div className="site-card-header">
                        <div className="site-card-title"><Briefcase size={16} />My Projects</div>
                        <span className="site-count">{myProjects.length}</span>
                    </div>
                    <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                        {myProjects.map(p => <ProjectCard key={p._id} project={p} />)}
                    </div>
                </div>
            )}

            <div className="site-dash-grid">
                <Section icon={<Flame size={15} />} title="Overdue" color="#ef4444" tasks={data?.overdue} empty="No overdue tasks!" />
                <Section icon={<CalendarClock size={15} />} title="Due Today" color="#f59e0b" tasks={data?.dueToday} empty="Nothing due today." />
                <Section icon={<TriangleAlert size={15} />} title="High Priority" color="#d97706" tasks={data?.highPriority} empty="No urgent tasks." />
            </div>

            <div className="site-card" style={{ marginTop: 24 }}>
                <div className="site-card-header">
                    <div className="site-card-title"><CheckSquare size={16} />Activity Feed</div>
                    <button style={{ fontSize: 13, color: '#10b981', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                        onClick={() => navigate('/site/tasks')}>View All</button>
                </div>
                {!data?.recentTasks?.length ? (
                    <div className="site-empty">
                        <Target size={36} />
                        <p>No tasks assigned yet</p>
                        <span>
                            {myProjects.length > 0
                                ? 'Your Project Manager will assign tasks for your projects soon.'
                                : 'Your Project Engineer will assign tasks shortly.'
                            }
                        </span>
                    </div>
                ) : data.recentTasks.map(t => <TaskRow key={t._id} task={t} />)}
            </div>

            <SiteSupervisorWidgets user={user} />
        </div>
    );
};

export default SiteDashboard;
