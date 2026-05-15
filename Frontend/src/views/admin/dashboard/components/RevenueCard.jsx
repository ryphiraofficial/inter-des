import React from 'react';
import Skeleton from '../../components/Skeleton';

const RevenueCard = ({ label, value, variant, icon: Icon, loading }) => {
    if (loading) {
        return (
            <div className={`revenue-card ${variant} loading`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Skeleton width="48px" height="48px" borderRadius="12px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="120px" height="14px" />
                        <div style={{ marginTop: '10px' }}>
                            <Skeleton width="180px" height="36px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`revenue-card ${variant}`}>
            <div className="revenue-icon-wrapper">
                <Icon size={24} />
            </div>
            <h3 className="revenue-label">{label}</h3>
            <p className="revenue-value">
                {value}
            </p>
        </div>
    );
};

export default RevenueCard;
