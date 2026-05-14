import React from 'react';
import Skeleton from './Skeleton';

const SalesTasksStats = ({ loading, stats, filterStatus, setFilterStatus }) => {
    return (
        <div className="st-stats-grid">
            {loading ? (
                [...Array(5)].map((_, i) => (
                    <div key={i} className="st-stat-card">
                        <div className="st-stat-info">
                            <Skeleton width="60px" height="12px" />
                            <div style={{ height: '4px' }} />
                            <Skeleton width="40px" height="24px" />
                        </div>
                    </div>
                ))
            ) : Object.entries(stats).map(([label, value]) => (
                <div
                    key={label}
                    className={`st-stat-card ${filterStatus === label ? 'selected' : ''}`}
                    onClick={() => {
                        if (label === 'Total') setFilterStatus('All');
                        else if (label === 'Review Required') setFilterStatus('Pending Sales Review');
                        else setFilterStatus(label);
                    }}
                >
                    <div className="st-stat-info">
                        <span className="st-stat-label">{label}</span>
                        <span className="st-stat-value">{value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesTasksStats;
