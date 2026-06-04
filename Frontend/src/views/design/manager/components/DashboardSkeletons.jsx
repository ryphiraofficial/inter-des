import React from 'react';
import Skeleton from '../../../common/Skeleton';

export const MeetingsSkeleton = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 600px' }}>
                <Skeleton width="180px" height="24px" style={{ marginBottom: '1.5rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2].map(idx => (
                        <div key={idx} style={{ padding: '20px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '180px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <Skeleton width="80px" height="24px" borderRadius="12px" />
                                </div>
                                <Skeleton width="70%" height="20px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="40%" height="14px" />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                <Skeleton width="100px" height="14px" />
                                <Skeleton width="80px" height="14px" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ flex: '1 1 300px' }}>
                <Skeleton width="160px" height="24px" style={{ marginBottom: '1.5rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    {[1, 2, 3].map(idx => (
                        <div key={idx} style={{ padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <Skeleton width="80px" height="20px" borderRadius="12px" />
                            </div>
                            <Skeleton width="50%" height="18px" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const PipelineSkeleton = () => (
    <div className="fade-in" style={{ padding: '1rem 10px 0 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            {[1, 2, 3, 4].map(col => (
                <div key={col} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <Skeleton width="120px" height="20px" />
                    </div>
                    {[1, 2, 3].map(card => (
                        <div key={card} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', height: '140px' }}>
                            <Skeleton width="70%" height="16px" style={{ marginBottom: '12px' }} />
                            <Skeleton width="40%" height="12px" style={{ marginBottom: '24px' }} />
                            <Skeleton width="90%" height="10px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="60%" height="10px" />
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', height: '200px' }}>
             <Skeleton width="200px" height="24px" style={{ marginBottom: '24px' }} />
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                 <Skeleton width="100%" height="100px" borderRadius="16px" />
                 <Skeleton width="100%" height="100px" borderRadius="16px" />
                 <Skeleton width="100%" height="100px" borderRadius="16px" />
             </div>
        </div>
    </div>
);

export const ProjectsSkeleton = () => (
    <div className="portfolio-modern fade-in" style={{ paddingTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {[1, 2, 3, 4].map(btn => (
                <div key={btn} style={{ padding: '8px 16px', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Skeleton width="16px" height="16px" borderRadius="4px" />
                    <Skeleton width="80px" height="14px" />
                    <Skeleton width="24px" height="16px" borderRadius="10px" />
                </div>
            ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(card => (
                <div key={card} className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                        <Skeleton width="100%" height="100%" borderRadius="0" />
                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                            <Skeleton width="80px" height="24px" borderRadius="12px" />
                        </div>
                    </div>
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <Skeleton width="80%" height="22px" style={{ marginBottom: '8px' }} />
                                <Skeleton width="30%" height="14px" />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Skeleton width="24px" height="24px" borderRadius="8px" />
                                <Skeleton width="70%" height="14px" />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <Skeleton width="24px" height="24px" borderRadius="8px" />
                                <Skeleton width="70%" height="14px" />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', gridColumn: 'span 2' }}>
                                <Skeleton width="24px" height="24px" borderRadius="8px" />
                                <Skeleton width="50%" height="14px" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                            <Skeleton width="100%" height="38px" borderRadius="8px" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const TasksSkeleton = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <Skeleton width="250px" height="28px" />
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Skeleton width="100px" height="36px" borderRadius="8px" />
                <Skeleton width="150px" height="36px" borderRadius="8px" />
            </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(card => (
                <div key={card} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <Skeleton width="70%" height="18px" />
                            <Skeleton width="20%" height="24px" borderRadius="12px" />
                        </div>
                        <Skeleton width="50%" height="14px" style={{ marginBottom: '1rem' }} />
                    </div>
                    <div>
                        <Skeleton width="100%" height="8px" borderRadius="4px" style={{ marginBottom: '8px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Skeleton width="30%" height="12px" />
                            <Skeleton width="30%" height="12px" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const StaffOverviewSkeleton = () => (
    <div className="fade-in" style={{ paddingTop: '1rem' }}>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Skeleton width="280px" height="28px" style={{ marginBottom: '12px' }} />
                <Skeleton width="220px" height="16px" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3, 4].map(card => (
                    <div key={card} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <Skeleton width="48px" height="48px" borderRadius="14px" />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Skeleton width="50%" height="18px" />
                                    <Skeleton width="60px" height="20px" borderRadius="8px" />
                                </div>
                                <Skeleton width="40%" height="14px" />
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Skeleton width="30%" height="12px" />
                                <Skeleton width="20%" height="12px" />
                            </div>
                            <Skeleton width="100%" height="8px" borderRadius="10px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const MaterialReviewSkeleton = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
            <div>
                <Skeleton width="200px" height="28px" style={{ marginBottom: '8px' }} />
                <Skeleton width="300px" height="16px" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Skeleton width="120px" height="40px" borderRadius="8px" />
                <Skeleton width="120px" height="40px" borderRadius="8px" />
            </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {[1, 2, 3].map(row => (
                <div key={row} style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', gap: '2rem' }}>
                    <div style={{ flex: 2 }}>
                        <Skeleton width="60%" height="22px" style={{ marginBottom: '12px' }} />
                        <Skeleton width="40%" height="14px" style={{ marginBottom: '2rem' }} />
                        <Skeleton width="80%" height="10px" style={{ marginBottom: '10px' }} />
                        <Skeleton width="75%" height="10px" style={{ marginBottom: '10px' }} />
                        <Skeleton width="85%" height="10px" />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <Skeleton width="100px" height="24px" borderRadius="12px" />
                        <Skeleton width="140px" height="40px" borderRadius="8px" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);
