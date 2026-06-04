import React from 'react';
import Skeleton from '../../common/Skeleton';

// 4. Assignments Skeleton (cards with avatars)
export const AssignmentsSkeleton = () => (
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
export const VendorsSkeleton = () => (
    <div className="procurement-premium-wrapper fade-in" style={{ padding: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Vendor Directory</h4>
            <Skeleton width="140px" height="38px" borderRadius="10px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(idx => (
                <div key={idx} style={{ background: '#ffffff', border: '1px solid #f5f5f4', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.02)' }}>
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
export const SourcingSkeleton = () => (
    <div className="procurement-premium-wrapper fade-in" style={{ padding: '1rem 0', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem' }}>
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
