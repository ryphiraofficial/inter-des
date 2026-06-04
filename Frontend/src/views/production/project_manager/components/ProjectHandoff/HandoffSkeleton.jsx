import React from 'react';

const HandoffSkeleton = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="pm-card" style={{ padding: '1.25rem' }}>
                    <div className="pm-skeleton-line" style={{ width: '62%', marginBottom: '10px' }} />
                    <div className="pm-skeleton-line" style={{ width: '46%', marginBottom: '16px' }} />
                    <div className="pm-skeleton-block" style={{ height: '52px', marginBottom: '14px' }} />
                    <div className="pm-skeleton-line" style={{ width: '35%', marginBottom: '10px' }} />
                    <div className="pm-skeleton-block" style={{ height: '38px', marginBottom: '10px' }} />
                    <div className="pm-skeleton-block" style={{ height: '38px', marginBottom: '10px' }} />
                    <div className="pm-skeleton-block" style={{ height: '38px', marginBottom: '16px' }} />
                    <div className="pm-skeleton-block" style={{ height: '44px' }} />
                </div>
            ))}
        </div>
    );
};

export default HandoffSkeleton;
