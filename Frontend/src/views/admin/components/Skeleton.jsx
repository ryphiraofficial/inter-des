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
                <Skeleton key={i} width="100px" height="16px" />
            ))}
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="skeleton-row">
                {[...Array(cols)].map((_, j) => (
                    <Skeleton key={j} width={j === 0 ? "150px" : "100px"} height="24px" />
                ))}
            </div>
        ))}
    </div>
);

export const StatsSkeleton = ({ count = 4 }) => (
    <div className="stats-skeleton">
        {[...Array(count)].map((_, i) => (
            <div key={i} className="skeleton-stat-card">
                <Skeleton width="40px" height="40px" borderRadius="10px" />
                <div className="stat-info">
                    <Skeleton width="60px" height="12px" />
                    <Skeleton width="80px" height="20px" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
