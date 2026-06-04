import React from 'react';

const ReportsSkeleton = () => {
    return (
        <div className="pm-dashboard pm-production-reports">
            <div className="pm-metrics-grid">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="pm-card pm-metric-card">
                        <div className="pm-skeleton-line" style={{ width: '58%', marginBottom: '14px' }} />
                        <div className="pm-skeleton-line" style={{ width: '34%', height: '34px', marginBottom: '10px' }} />
                        <div className="pm-skeleton-line" style={{ width: '52%' }} />
                    </div>
                ))}
            </div>
            <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
                <div className="pm-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="pm-reports-table-header">
                        <div className="pm-skeleton-line" style={{ width: '42%', height: '24px' }} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="pm-skeleton-block" style={{ height: '96px', marginBottom: idx === 2 ? 0 : '0.75rem' }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsSkeleton;
