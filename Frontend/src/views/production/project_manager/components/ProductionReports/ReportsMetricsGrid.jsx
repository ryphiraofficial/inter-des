import React from 'react';
import { Briefcase, CheckCircle2, Activity, Clock } from 'lucide-react';

const ReportsMetricsGrid = ({ projects, tasks, materials, leaves }) => {
    return (
        <div className="pm-metrics-grid">
            <div className="pm-card pm-metric-card">
                <div className="pm-metric-header">
                    <Briefcase size={20} /> <span>Project Health</span>
                </div>
                <div className="pm-metric-value">{projects.active} <span>Active</span></div>
                <div className="pm-metric-footer" style={{ color: projects.delayed > 0 ? '#ef4444' : '#10b981' }}>{projects.delayed} delayed projects</div>
            </div>

            <div className="pm-card pm-metric-card">
                <div className="pm-metric-header">
                    <CheckCircle2 size={20} /> <span>Task Completion</span>
                </div>
                <div className="pm-metric-value">{tasks.completed} <span>/ {tasks.total}</span></div>
                <div className="pm-metric-footer" style={{ color: tasks.overdue > 0 ? '#ef4444' : '#10b981' }}>{tasks.overdue} tasks overdue</div>
            </div>

            <div className="pm-card pm-metric-card">
                <div className="pm-metric-header">
                    <Activity size={20} /> <span>Resource Requests</span>
                </div>
                <div className="pm-metric-value">{materials.pending} <span>Pending</span></div>
                <div className="pm-metric-footer" style={{ color: '#64748b' }}>{materials.total} total material requests</div>
            </div>

            <div className="pm-card pm-metric-card">
                <div className="pm-metric-header">
                    <Clock size={20} /> <span>Team Leaves</span>
                </div>
                <div className="pm-metric-value">{leaves.pending} <span>Pending</span></div>
                <div className="pm-metric-footer" style={{ color: '#64748b' }}>Require your review</div>
            </div>
        </div>
    );
};

export default ReportsMetricsGrid;
