import React from 'react';
import './css/Skeleton.css';

export const Skeleton = ({ width, height, borderRadius = '8px', className = '' }) => (
    <div 
        className={`skeleton-shimmer ${className}`} 
        style={{ width, height, borderRadius }}
    />
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="table-skeleton">
        <div className="skeleton-header">
            {[...Array(cols)].map((_, i) => (
                <Skeleton key={i} width={i === 0 ? "150px" : "110px"} height="18px" />
            ))}
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="skeleton-row">
                {[...Array(cols)].map((_, j) => (
                    <Skeleton key={j} width={j === 0 ? "200px" : "120px"} height="28px" />
                ))}
            </div>
        ))}
    </div>
);

export const StatsSkeleton = ({ count = 4 }) => (
    <div className="stats-skeleton">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="skeleton-stat-card">
                <Skeleton width="48px" height="48px" borderRadius="12px" />
                <div className="stat-info" style={{ flex: 1 }}>
                    <Skeleton width="40%" height="14px" />
                    <div style={{ height: '4px' }} />
                    <Skeleton width="65%" height="24px" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
