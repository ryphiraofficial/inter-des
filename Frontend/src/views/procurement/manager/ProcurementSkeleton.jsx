import React from 'react';
import Skeleton from '../../common/Skeleton';
import '../css/ProcurementPremium.css';

const ProcurementSkeleton = () => {
    return (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '0' }}>
            {/* Elegant Minimalist Banner */}
            <div className="premium-banner" style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Skeleton width="80px" height="24px" borderRadius="20px" />
                </div>
                <Skeleton width="320px" height="42px" style={{ marginBottom: '0.75rem' }} />
                <Skeleton width="550px" height="18px" />
            </div>

            {/* Elegant Stat Cards */}
            <div className="glass-stats-grid" style={{ marginBottom: '2rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="glass-stat-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <Skeleton width="45px" height="36px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="110px" height="13px" />
                            </div>
                            <Skeleton width="40px" height="40px" borderRadius="12px" />
                        </div>
                        <div style={{ height: '40px', width: '100%', marginTop: '1rem' }}>
                            <Skeleton width="100%" height="100%" borderRadius="8px" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="premium-chart-grid" style={{ marginBottom: '2rem' }}>
                <div className="premium-chart-card" style={{ padding: '1.5rem' }}>
                    <div className="chart-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width="160px" height="22px" />
                        <Skeleton width="70px" height="22px" borderRadius="20px" />
                    </div>
                    <Skeleton width="100%" height="280px" borderRadius="16px" />
                </div>

                <div className="premium-chart-card" style={{ padding: '1.5rem' }}>
                    <div className="chart-header" style={{ marginBottom: '1.5rem' }}>
                        <Skeleton width="160px" height="22px" />
                    </div>
                    <div style={{ height: '280px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Skeleton width="210px" height="210px" borderRadius="50%" />
                    </div>
                </div>
            </div>

            {/* Dual Lists */}
            <div className="premium-list-grid">
                <div className="list-panel" style={{ padding: '1.5rem' }}>
                    <div className="chart-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width="180px" height="22px" />
                        <Skeleton width="90px" height="22px" borderRadius="20px" />
                    </div>
                    {[1, 2, 3].map(item => (
                        <div key={item} className="list-item-modern" style={{ padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                            <Skeleton width="42px" height="42px" borderRadius="10px" />
                            <div style={{ flex: 1, marginLeft: '1rem' }}>
                                <Skeleton width="65%" height="17px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="45%" height="13px" />
                            </div>
                            <Skeleton width="34px" height="34px" borderRadius="8px" />
                        </div>
                    ))}
                </div>

                <div className="list-panel" style={{ padding: '1.5rem' }}>
                    <div className="chart-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width="180px" height="22px" />
                        <Skeleton width="90px" height="22px" borderRadius="20px" />
                    </div>
                    {[1, 2, 3].map(item => (
                        <div key={item} className="list-item-modern" style={{ padding: '1rem 0', borderBottom: '1px solid #f1f5f9' }}>
                            <Skeleton width="42px" height="42px" borderRadius="10px" />
                            <div style={{ flex: 1, marginLeft: '1rem' }}>
                                <Skeleton width="65%" height="17px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="45%" height="13px" />
                            </div>
                            <Skeleton width="34px" height="34px" borderRadius="8px" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProcurementSkeleton;
