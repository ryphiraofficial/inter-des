import React from 'react';
import Skeleton from './Skeleton';

const SalesStatsGrid = ({ stats, pendingReviews = [], loading }) => {
    const statCards = [
        { label: 'Pending Tasks', value: stats?.pendingTasks || 0 },
        { label: 'Done Today', value: stats?.completedToday || 0 },
        { label: 'Active Projects', value: stats?.activeProjects || 0 },
        { label: 'Pending Reviews', value: pendingReviews?.length || 0 },
    ];

    if (loading) {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem'
            }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                        <Skeleton width="80px" height="14px" />
                        <div style={{ marginTop: '12px' }}>
                            <Skeleton width="60px" height="28px" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem'
        }}>
            {statCards.map((item, idx) => (
                <div
                    key={idx}
                    style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        padding: '1.25rem',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-out'
                    }}
                >
                    <span style={{
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: '#64748b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '6px'
                    }}>
                        {item.label}
                    </span>
                    <h2 style={{
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        letterSpacing: '-0.03em',
                        margin: 0
                    }}>
                        {item.value}
                    </h2>
                </div>
            ))}
        </div>
    );
};

export default SalesStatsGrid;
