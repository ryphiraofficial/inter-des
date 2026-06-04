import React from 'react';
import { Palette, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';
import '../css/ManagerDashboard.css';
import { PendingReviewsPanel, HandoffPipelinePanel } from './components/OverviewPanels';

const DesignOverview = ({ stats, tasks, quotations, teamStats, materialRequests }) => {
    const pendingReviews = (tasks || []).filter(t => t.status === 'Review Pending');
    const redos    = (tasks || []).filter(t => t.status === 'Revision Required');
    const approved = (tasks || []).filter(t => t.status === 'Approved');

    const pieData = [
        { name: 'Pending',   value: pendingReviews.length, color: '#f59e0b' },
        { name: 'Approved',  value: approved.length,        color: '#10b981' },
        { name: 'Revisions', value: redos.length,           color: '#ef4444' }
    ];

    const weeklyVelocity = [
        { name: 'Mon', designs: 3 }, { name: 'Tue', designs: 5 }, { name: 'Wed', designs: 8 },
        { name: 'Thu', designs: 6 }, { name: 'Fri', designs: 10 }, { name: 'Sat', designs: 4 },
        { name: 'Sun', designs: 2 }
    ];

    const teamWorkload = (teamStats || []).map(m => ({ name: m.name, tasks: m.activeTasks || 0 })).slice(0, 5);

    const chartCardStyle = { background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' };
    const axisProps      = { axisLine: false, tickLine: false, tick: { fontSize: 12, fill: '#94a3b8' } };
    const tooltipStyle   = { borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' };

    return (
        <div className="design-overview fade-in">
            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                {[
                    { label: 'Active Designs',   value: tasks?.length || 0,  icon: Palette,      bg: '#f5f3ff', color: '#8b5cf6' },
                    { label: 'Pending Reviews',  value: pendingReviews.length, icon: Clock,       bg: '#fff7ed', color: '#f97316' },
                    { label: 'Active Redos',     value: redos.length,          icon: AlertCircle, bg: '#fef2f2', color: '#ef4444' },
                    { label: 'Total Approved',   value: approved.length,       icon: CheckCircle, bg: '#ecfdf5', color: '#10b981' },
                ].map(({ label, value, icon: Icon, bg, color }) => (
                    <div key={label} className="stat-card premium">
                        <div className="stat-icon" style={{ background: bg, color }}><Icon size={24} /></div>
                        <div className="stat-content">
                            <span className="stat-label">{label}</span>
                            <span className="stat-value">{value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="visuals-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="card-premium" style={chartCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>Creative Velocity</h4>
                        <span className="badge-lite">Weekly Output</span>
                    </div>
                    <div style={{ height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyVelocity}>
                                <defs>
                                    <linearGradient id="colorDesigns" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" {...axisProps} />
                                <YAxis {...axisProps} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="designs" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorDesigns)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-premium" style={chartCardStyle}>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#1e293b', marginBottom: '1.5rem' }}>Portfolio Health</h4>
                    <div style={{ height: '260px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}>{tasks?.length || 0}</div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Total Tasks</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Bar Chart */}
            <div className="card-premium" style={{ ...chartCardStyle, marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>Designer Capacity</h4>
                    <span className="badge-lite">Active Workload</span>
                </div>
                <div style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={teamWorkload}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" {...axisProps} />
                            <YAxis {...axisProps} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={tooltipStyle} />
                            <Bar dataKey="tasks" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List Panels */}
            <div className="dashboard-grid">
                <PendingReviewsPanel pendingReviews={pendingReviews} />
                <HandoffPipelinePanel tasks={tasks} />
            </div>
        </div>
    );
};

export default DesignOverview;
