import React from 'react';
import Skeleton from '../../common/Skeleton';
import '../css/ManagerDashboard.css';

const DesignSkeleton = () => {
    return (
        <div className="design-overview fade-in" style={{ padding: '0' }}>
            {/* Creative Banner Skeleton */}
            <div className="welcome-banner" style={{ background: '#f1f5f9', borderRadius: '24px', padding: '2.5rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Skeleton width="40px" height="40px" borderRadius="12px" />
                    <Skeleton width="150px" height="16px" />
                </div>
                <Skeleton width="450px" height="48px" style={{ marginBottom: '12px' }} />
                <Skeleton width="600px" height="20px" />
            </div>

            {/* Premium Stats Grid Skeleton */}
            <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="stat-card premium" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Skeleton width="56px" height="56px" borderRadius="16px" />
                        <div>
                            <Skeleton width="100px" height="14px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="60px" height="28px" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Visual Analytics Row Skeleton */}
            <div className="visuals-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="card-premium" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <Skeleton width="180px" height="24px" />
                        <Skeleton width="100px" height="24px" borderRadius="12px" />
                    </div>
                    <Skeleton width="100%" height="260px" borderRadius="16px" />
                </div>

                <div className="card-premium" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <Skeleton width="180px" height="24px" style={{ marginBottom: '2rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '260px' }}>
                        <Skeleton width="200px" height="200px" borderRadius="50%" />
                    </div>
                </div>
            </div>

            {/* Operational Lists Skeleton */}
            <div className="dashboard-grid">
                {[1, 2].map(panel => (
                    <div key={panel} className="card-premium" style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <Skeleton width="24px" height="24px" borderRadius="6px" />
                                <Skeleton width="200px" height="22px" />
                            </div>
                            <Skeleton width="300px" height="14px" />
                        </div>
                        {[1, 2, 3].map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '16px', marginBottom: '12px' }}>
                                <Skeleton width="46px" height="46px" borderRadius="12px" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="70%" height="18px" style={{ marginBottom: '8px' }} />
                                    <Skeleton width="50%" height="13px" />
                                </div>
                                <Skeleton width="80px" height="24px" borderRadius="12px" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DesignSkeleton;
