import React from 'react';

const PMDashboardSkeleton = () => {
    return (
        <div className="role-dashboard production-manager">
            <div className="pm-skeleton-block" style={{ height: '92px', marginBottom: '1.5rem' }} />
            <div className="stats-grid">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="stat-card">
                        <div className="pm-skeleton-circle" />
                        <div style={{ flex: 1 }}>
                            <div className="pm-skeleton-line" style={{ width: '38%', marginBottom: '8px' }} />
                            <div className="pm-skeleton-line" style={{ width: '72%' }} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="pm-skeleton-block" style={{ height: '240px', marginBottom: '1.5rem' }} />
            <div className="dashboard-sections">
                <div className="pm-skeleton-block" style={{ height: '320px' }} />
                <div className="pm-skeleton-block" style={{ height: '320px' }} />
            </div>
            <div className="pm-skeleton-block" style={{ height: '120px', marginTop: '1.5rem' }} />
        </div>
    );
};

export default PMDashboardSkeleton;
