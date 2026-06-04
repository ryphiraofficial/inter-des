import React from 'react';

const TeamTableSkeleton = () => {
    return (
        <div className="pm-table-container">
            <table className="pm-table">
                <thead>
                    <tr>
                        <th>Member Profile</th>
                        <th className="pm-desktop-only">Reporting Team</th>
                        <th className="pm-desktop-only">Workload & Capacity</th>
                        <th className="pm-desktop-only">Performance</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                        <th className="pm-mobile-only"></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 4 }).map((_, rowIdx) => (
                        <tr key={`skeleton-row-${rowIdx}`} className="pm-table-row">
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="pm-skeleton-block" style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="pm-skeleton-line" style={{ width: '60%', height: '16px', marginBottom: '8px' }} />
                                        <div className="pm-skeleton-line" style={{ width: '40%', height: '12px' }} />
                                    </div>
                                </div>
                            </td>
                            <td className="pm-desktop-only">
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <div className="pm-skeleton-line" style={{ width: '40px', height: '18px', borderRadius: '4px' }} />
                                    <div className="pm-skeleton-line" style={{ width: '50px', height: '18px', borderRadius: '4px' }} />
                                </div>
                            </td>
                            <td className="pm-desktop-only" style={{ minWidth: '160px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div className="pm-skeleton-line" style={{ width: '40%', height: '12px' }} />
                                        <div className="pm-skeleton-line" style={{ width: '20%', height: '12px' }} />
                                    </div>
                                    <div className="pm-skeleton-line" style={{ width: '100%', height: '6px' }} />
                                </div>
                            </td>
                            <td className="pm-desktop-only">
                                <div className="pm-skeleton-line" style={{ width: '70px', height: '24px', borderRadius: '8px' }} />
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <div className="pm-skeleton-circle pm-desktop-only" style={{ width: '28px', height: '28px' }} />
                                    <div className="pm-skeleton-circle" style={{ width: '28px', height: '28px' }} />
                                </div>
                            </td>
                            <td className="pm-mobile-only">
                                <div className="pm-skeleton-circle" style={{ width: '18px', height: '18px', marginLeft: 'auto' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamTableSkeleton;
