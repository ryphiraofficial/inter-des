import React from 'react';
import { Loader, Plus, Calendar, Image as ImageIcon, CheckCircle } from 'lucide-react';

const TasksStatsGrid = ({ tasks, filterStatus, setFilterStatus }) => {
    const statsCards = [
        { label: 'Total Tasks', value: tasks.length, color: 'purple', icon: <Loader size={20} />, status: 'All' },
        { label: 'To Do', value: tasks.filter(t => t.status === 'To Do').length, color: 'orange', icon: <Plus size={20} />, status: 'To Do' },
        { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, color: 'blue', icon: <Calendar size={20} />, status: 'In Progress' },
        { label: 'Design Approvals', value: tasks.filter(t => t.status === 'Pending Admin Review').length, color: 'indigo', icon: <ImageIcon size={20} />, status: 'Pending Admin Review' },
        { label: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, color: 'green', icon: <CheckCircle size={20} />, status: 'Completed' },
    ];

    return (
        <div className="tasks-stats-grid">
            {statsCards.map((stat, i) => (
                <div
                    key={i}
                    className={`tasks-stat-card stat-${stat.color} ${filterStatus === stat.status ? 'selected' : ''}`}
                    onClick={() => setFilterStatus(stat.status)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-content">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                    <div className="stat-icon-box">
                        {stat.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TasksStatsGrid;
