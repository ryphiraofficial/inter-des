import React from 'react';
import { Target, CheckSquare, AlertTriangle, CheckCircle } from 'lucide-react';

const PMStatsGrid = ({ projects, stats }) => {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <div className="stat-icon production">
                    <Target size={22} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{projects.length}</span>
                    <span className="stat-label">Active Projects</span>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon info">
                    <CheckSquare size={22} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.tasks?.inProgress || 0}</span>
                    <span className="stat-label">Tasks In Progress</span>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon warning">
                    <AlertTriangle size={22} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.tasks?.blocked || 0}</span>
                    <span className="stat-label">Blocked Tasks</span>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon success">
                    <CheckCircle size={22} />
                </div>
                <div className="stat-content">
                    <span className="stat-value">{stats?.tasks?.completed || 0}</span>
                    <span className="stat-label">Completed</span>
                </div>
            </div>
        </div>
    );
};

export default PMStatsGrid;
