import React from 'react';
import Skeleton from '../../components/Skeleton';

const NewQuotationSkeleton = () => {
    return (
        <div className="new-quote-wrapper skeleton-mode">
            <div className="form-container">
                <div className="form-section">
                    <div className="section-header-row">
                        <Skeleton width="180px" height="24px" />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <Skeleton width="100px" height="16px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="100%" height="45px" borderRadius="12px" />
                        </div>
                        <div className="form-group">
                            <Skeleton width="100px" height="16px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="100%" height="45px" borderRadius="12px" />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <Skeleton width="120px" height="16px" style={{ marginBottom: '8px' }} />
                        <Skeleton width="100%" height="45px" borderRadius="12px" />
                    </div>
                </div>

                <div className="form-section" style={{ marginTop: '2rem' }}>
                    <div className="section-header-row">
                        <Skeleton width="150px" height="24px" />
                    </div>
                    <div className="line-item-container">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="line-item-card skeleton" style={{ padding: '1.5rem', marginBottom: '1rem', background: 'white', borderRadius: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 150px 100px', gap: '1rem' }}>
                                    <Skeleton width="100%" height="24px" />
                                    <Skeleton width="80px" height="24px" />
                                    <Skeleton width="120px" height="24px" />
                                    <Skeleton width="80px" height="24px" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewQuotationSkeleton;
