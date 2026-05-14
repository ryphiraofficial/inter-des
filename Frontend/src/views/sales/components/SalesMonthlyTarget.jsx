import React from 'react';
import Skeleton from './Skeleton';

const SalesMonthlyTarget = ({ loading }) => {
    return (
        <div className="target-card">
            <div className="section-header">
                <h2 className="section-title">Monthly Target Progress</h2>
            </div>
            <div className="target-content">
                {loading ? (
                    <>
                        <div className="target-stats">
                            <div className="target-stat">
                                <Skeleton width="60px" height="12px" />
                                <Skeleton width="100px" height="24px" style={{ marginTop: '6px' }} />
                            </div>
                            <div className="target-stat right">
                                <Skeleton width="40px" height="12px" />
                                <Skeleton width="100px" height="24px" style={{ marginTop: '6px' }} />
                            </div>
                        </div>
                        <Skeleton width="100%" height="12px" borderRadius="99px" style={{ marginTop: '16px' }} />
                        <Skeleton width="60%" height="14px" style={{ marginTop: '12px' }} />
                    </>
                ) : (
                    <>
                        <div className="target-stats">
                            <div className="target-stat">
                                <span className="target-label">Achieved</span>
                                <span className="target-value">₹3,50,000</span>
                            </div>
                            <div className="target-stat right">
                                <span className="target-label">Goal</span>
                                <span className="target-value">₹5,00,000</span>
                            </div>
                        </div>
                        <div className="target-progress-container">
                            <div className="target-progress-bar" style={{ width: '70%' }}></div>
                        </div>
                        <p className="target-message">You're on track! 70% of monthly goal reached.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SalesMonthlyTarget;
