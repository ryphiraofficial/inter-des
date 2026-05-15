import React from 'react';
import Skeleton from './components/Skeleton';
import './css/Inventory.css';

const InventorySkeleton = () => {
    return (
        <div className="inventory-container fade-in" style={{ padding: '1.5rem' }}>
            <div className="inventory-wrapper">
                {/* Header Skeleton */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <Skeleton width="200px" height="32px" />
                    <Skeleton width="160px" height="45px" borderRadius="12px" />
                </div>

                {/* Filter Scroll Skeleton */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', overflow: 'hidden' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} width="100px" height="38px" borderRadius="10px" />
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="inventory-table-card">
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '2rem' }}>
                        <Skeleton width="40%" height="16px" />
                        <Skeleton width="15%" height="16px" />
                        <Skeleton width="15%" height="16px" />
                        <Skeleton width="15%" height="16px" />
                    </div>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '0 0 40%' }}>
                                <Skeleton width="40px" height="40px" borderRadius="8px" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="60%" height="18px" style={{ marginBottom: '6px' }} />
                                    <Skeleton width="40%" height="14px" />
                                </div>
                            </div>
                            <Skeleton width="15%" height="24px" borderRadius="20px" />
                            <Skeleton width="15%" height="20px" />
                            <Skeleton width="15%" height="20px" />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Skeleton width="32px" height="32px" borderRadius="8px" />
                                <Skeleton width="32px" height="32px" borderRadius="8px" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InventorySkeleton;
