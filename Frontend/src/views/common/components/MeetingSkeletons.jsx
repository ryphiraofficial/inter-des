import React from 'react';
import Skeleton from '../../common/Skeleton';

// Skeleton shown while meetings load — upstream section
export const MeetingsUpcomingSkeleton = () => (
    <div className="meetings-upcoming-section">
        <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Upcoming &amp; Live</p>
        <div className="meetings-list">
            {[1, 2].map(idx => (
                <div key={idx} className="meeting-card" style={{ padding: '20px' }}>
                    <div className="meeting-card-header" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <Skeleton width="80px" height="24px" borderRadius="12px" />
                        </div>
                        <Skeleton width="60%" height="20px" style={{ marginBottom: '8px' }} />
                        <Skeleton width="40%" height="14px" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                        <Skeleton width="100px" height="14px" />
                        <Skeleton width="80px" height="14px" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Skeleton shown while meetings load — history section
export const MeetingsHistorySkeleton = () => (
    <div className="meetings-history-section">
        <p className="staff-meetings-section-title" style={{ marginTop: 0 }}>Meeting History</p>
        <div className="meetings-list" style={{ gridTemplateColumns: '1fr' }}>
            {[1, 2, 3].map(idx => (
                <div key={idx} className="meeting-card" style={{ padding: '16px' }}>
                    <div className="meeting-card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Skeleton width="80px" height="20px" borderRadius="12px" />
                        </div>
                        <Skeleton width="50%" height="18px" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
