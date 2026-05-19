import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Skeleton from '../../common/Skeleton';
import '../css/ProcurementPremium.css';

const ProcurementSkeleton = ({ role }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const isManager = role === 'manager';

    // 1. Manager Overview / Dashboard Skeleton
    const renderManagerOverview = () => (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '0' }}>
            {/* Elegant Stat Cards */}
            <div className="glass-stats-grid" style={{ marginBottom: '2rem' }}>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="glass-stat-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <Skeleton width="45px" height="36px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="110px" height="13px" />
                            </div>
                            <Skeleton width="40px" height="40px" borderRadius="50%" />
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
                {[1, 2].map(listIdx => (
                    <div key={listIdx} className="list-panel" style={{ padding: '1.5rem' }}>
                        <div className="chart-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Skeleton width="180px" height="22px" />
                            <Skeleton width="90px" height="22px" borderRadius="20px" />
                        </div>
                        {[1, 2, 3].map(item => (
                            <div key={item} className="list-item-modern" style={{ padding: '1rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' }}>
                                <Skeleton width="42px" height="42px" borderRadius="50%" />
                                <div style={{ flex: 1, marginLeft: '1rem' }}>
                                    <Skeleton width="65%" height="17px" style={{ marginBottom: '8px' }} />
                                    <Skeleton width="45%" height="13px" />
                                </div>
                                <Skeleton width="34px" height="34px" borderRadius="50%" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    // 2. Staff Overview / Dashboard Skeleton
    const renderStaffOverview = () => (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '0' }}>
            {/* Stats Grid - 3 Columns */}
            <div className="glass-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-stat-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <Skeleton width="44px" height="44px" borderRadius="50%" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Skeleton width="50px" height="24px" style={{ marginBottom: '4px' }} />
                                <Skeleton width="100px" height="12px" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dual Lists */}
            <div className="premium-list-grid">
                {[1, 2].map(listIdx => (
                    <div key={listIdx} className="list-panel" style={{ padding: '1.5rem' }}>
                        <div className="chart-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Skeleton width="160px" height="22px" />
                            <Skeleton width="80px" height="22px" borderRadius="20px" />
                        </div>
                        {[1, 2, 3, 4].map(item => (
                            <div key={item} className="list-item-modern" style={{ padding: '1rem 0', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' }}>
                                <Skeleton width="40px" height="40px" borderRadius="50%" />
                                <div style={{ flex: 1, marginLeft: '1rem' }}>
                                    <Skeleton width="60%" height="16px" style={{ marginBottom: '6px' }} />
                                    <Skeleton width="40%" height="12px" />
                                </div>
                                <Skeleton width="30px" height="30px" borderRadius="50%" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );

    // 3. Grid / Table List Skeleton (for Handoffs, Requests, Completed, History, Tasks)
    const renderListSkeleton = (titleText) => (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '1rem 0' }}>
            <div className="list-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>{titleText}</h4>
                        <Skeleton width="150px" height="12px" />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Skeleton width="120px" height="38px" borderRadius="10px" />
                    </div>
                </div>

                {/* Repeating Row Elements */}
                {[1, 2, 3, 4, 5].map(idx => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderBottom: '1px solid #f5f5f4' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
                            <Skeleton width="40px" height="40px" borderRadius="12px" style={{ marginRight: '1rem' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '60%' }}>
                                <Skeleton width="80%" height="16px" />
                                <Skeleton width="50%" height="12px" />
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <Skeleton width="80px" height="24px" borderRadius="20px" />
                        </div>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Skeleton width="120px" height="36px" borderRadius="10px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // 4. Assignments Skeleton (cards with avatars)
    const renderAssignmentsSkeleton = () => (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Procurement Assignments</h4>
                <Skeleton width="120px" height="36px" borderRadius="10px" />
            </div>

            {[1, 2, 3].map(idx => (
                <div key={idx} className="assigned-item-premium" style={{ background: '#ffffff', border: '1px solid #f5f5f4', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <Skeleton width="180px" height="18px" />
                            <Skeleton width="280px" height="13px" />
                        </div>
                        <Skeleton width="120px" height="24px" borderRadius="100px" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid #f5f5f4' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Skeleton width="36px" height="36px" borderRadius="50%" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Skeleton width="60px" height="10px" />
                                <Skeleton width="110px" height="14px" />
                            </div>
                        </div>
                        <Skeleton width="140px" height="38px" borderRadius="12px" />
                    </div>
                </div>
            ))}
        </div>
    );

    // 5. Vendor Cards Skeleton (grid layout)
    const renderVendorsSkeleton = () => (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Vendor Directory</h4>
                <Skeleton width="140px" height="38px" borderRadius="10px" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3, 4, 5, 6].map(idx => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #f5f5f4', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
                            <Skeleton width="44px" height="44px" borderRadius="50%" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                                <Skeleton width="80%" height="16px" />
                                <Skeleton width="50%" height="12px" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                            <Skeleton width="90%" height="12px" />
                            <Skeleton width="75%" height="12px" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #fafaf9' }}>
                            <Skeleton width="70px" height="20px" borderRadius="20px" />
                            <Skeleton width="90px" height="30px" borderRadius="8px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // 6. Staff Sourcing Hub Workspace Skeleton
    const renderSourcingSkeleton = () => (
        <div className="procurement-premium-wrapper fade-in" style={{ padding: '1rem 0', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
            {/* Left Panel */}
            <div className="list-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                    <Skeleton width="180px" height="24px" />
                    <Skeleton width="100%" height="42px" borderRadius="10px" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[1, 2, 3, 4].map(idx => (
                        <div key={idx} style={{ padding: '1rem', border: '1px solid #f5f5f4', borderRadius: '12px' }}>
                            <Skeleton width="60%" height="16px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="40%" height="13px" style={{ marginBottom: '12px' }} />
                            <Skeleton width="100%" height="32px" borderRadius="8px" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="list-panel" style={{ padding: '2rem' }}>
                <Skeleton width="130px" height="22px" style={{ marginBottom: '1.5rem' }} />
                <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '2px dashed #f5f5f4', borderRadius: '16px' }}>
                    <Skeleton width="60px" height="60px" borderRadius="50%" style={{ marginBottom: '1rem' }} />
                    <Skeleton width="150px" height="15px" style={{ marginBottom: '8px' }} />
                    <Skeleton width="100px" height="11px" />
                </div>
            </div>
        </div>
    );

    // Tab Router switcher
    if (isManager) {
        switch (activeTab) {
            case 'overview':
                return renderManagerOverview();
            case 'handoffs':
                return renderListSkeleton('Design Handoff Queue');
            case 'requests':
                return renderListSkeleton('Material Requests');
            case 'assignments':
                return renderAssignmentsSkeleton();
            case 'vendors':
                return renderVendorsSkeleton();
            case 'completed':
                return renderListSkeleton('Completed Requests');
            default:
                return renderManagerOverview();
        }
    } else {
        switch (activeTab) {
            case 'overview':
                return renderStaffOverview();
            case 'sourcing':
                return renderSourcingSkeleton();
            case 'tasks':
                return renderListSkeleton('My Active Tasks');
            case 'history':
                return renderListSkeleton('Purchase History');
            case 'vendors':
                return renderVendorsSkeleton();
            default:
                return renderStaffOverview();
        }
    }
};

export default ProcurementSkeleton;
