import React from 'react';
import { Loader, Plus, Calendar, Image as ImageIcon, CheckCircle } from 'lucide-react';

const TasksStatsGrid = ({ tasks }) => {
    const statsCards = [
        { label: 'Total Tasks', value: tasks.length, color: '#a855f7', bg: '#faf5ff', icon: <Loader size={18} /> },
        { label: 'To Do', value: tasks.filter(t => t.status === 'To Do').length, color: '#f97316', bg: '#fff7ed', icon: <Plus size={18} /> },
        { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: '#3b82f6', bg: '#eff6ff', icon: <Calendar size={18} /> },
        { label: 'Design Approvals', value: tasks.filter(t => t.status === 'Pending Admin Review').length, color: '#6366f1', bg: '#eef2ff', icon: <ImageIcon size={18} /> },
        { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: '#16a34a', bg: '#f0fdf4', icon: <CheckCircle size={18} /> },
    ];

    return (
        <div className="tasks-stats-grid">
            {statsCards.map((stat, i) => (
                <div
                    key={i}
                    style={{
                        background: '#ffffff',
                        borderRadius: '14px',
                        border: 'none',
                        boxShadow: 'none',
                        padding: '1.25rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justify: 'space-between'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                            {stat.label}
                        </h3>
                        <div style={{ backgroundColor: stat.bg, color: stat.color, width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {stat.icon}
                        </div>
                    </div>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginTop: '2px' }}>
                        {stat.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TasksStatsGrid;
