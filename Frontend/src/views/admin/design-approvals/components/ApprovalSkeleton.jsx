import React from 'react';
import Skeleton from '../../components/Skeleton';

const ApprovalSkeleton = () => {
    return (
        <div className="tasks-container">
            <div className="tasks-wrapper" style={{ maxWidth: '1600px' }}>
                <div className="t-tasks-header" style={{ marginBottom: '2.5rem' }}>
                    <Skeleton width="180px" height="40px" />
                    <Skeleton width="160px" height="60px" borderRadius="16px" />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
                    <Skeleton width="180px" height="40px" borderRadius="0" />
                    <Skeleton width="180px" height="40px" borderRadius="0" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))', gap: '2rem' }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <Skeleton width="100%" height="200px" borderRadius="0" />
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <Skeleton width="180px" height="24px" />
                                        <div style={{ marginTop: '8px' }}>
                                            <Skeleton width="120px" height="14px" />
                                        </div>
                                    </div>
                                    <Skeleton width="36px" height="36px" borderRadius="12px" />
                                </div>
                                <Skeleton width="100%" height="40px" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '20px 0' }}>
                                    <Skeleton width="100%" height="45px" borderRadius="16px" />
                                    <Skeleton width="100%" height="45px" borderRadius="16px" />
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <Skeleton width="50%" height="45px" borderRadius="12px" />
                                    <Skeleton width="50%" height="45px" borderRadius="12px" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ApprovalSkeleton;
