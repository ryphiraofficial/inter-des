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
        <div className={`revenue-card ${variant}`} style={{
            background: variant === 'green' ? 'linear-gradient(135deg, #064e3b 0%, #047857 100%)' : 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)',
            borderRadius: '16px',
            padding: '1.5rem 1.75rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            boxShadow: 'none'
        }}>
            <div className="revenue-icon-wrapper" style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
            }}>
                <Icon size={24} color="#ffffff" />
            </div>
            <div>
                <h3 className="revenue-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>{label}</h3>
                <p className="revenue-value" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '2px 0 0', letterSpacing: '-0.02em' }}>
                    {value}
                </p>
            </div>
        </div>
    );
};

export default RevenueCard;
