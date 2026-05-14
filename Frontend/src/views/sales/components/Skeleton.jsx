import React from 'react';
import './css/Skeleton.css';

const Skeleton = ({ width, height, borderRadius = '8px', className = '' }) => (
    <div 
        className={`skeleton-shimmer ${className}`} 
        style={{ width, height, borderRadius }}
    />
);

export default Skeleton;
