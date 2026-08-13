import React from 'react';

const StaffOverviewTab = ({ staffList, tasks, setSelectedStaff, setShowStaffTasksModal }) => {
    return (
        <div className="fade-in" style={{ paddingTop: '1rem' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                    {staffList.map(member => {
                        const activeCount = tasks.filter(t => t.assignedTo?.some(s => s._id === member._id) && !['Completed', 'Approved', 'Pushed to Procurement'].includes(t.status)).length;
                        const isOverloaded = activeCount > 3;
                        
                        return (
                            <div 
                                key={member._id} 
                                style={{ 
                                    background: '#ffffff', 
                                    borderRadius: '12px', 
                                    padding: '1.25rem 1.5rem', 
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    boxShadow: 'none'
                                }}
                                onClick={() => { setSelectedStaff(member); setShowStaffTasksModal(true); }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                                    {/* Avatar */}
                                    <div style={{ 
                                        width: '44px', height: '44px', 
                                        borderRadius: '10px', 
                                        background: isOverloaded ? '#fef2f2' : '#f0fdf4', 
                                        color: isOverloaded ? '#ef4444' : '#10b981', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: '1.1rem', fontWeight: 800,
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        {(member.name || 'S').charAt(0).toUpperCase()}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>{member.name}</h4>
                                            <span style={{ 
                                                fontSize: '0.7rem', fontWeight: 700, 
                                                padding: '3px 8px', borderRadius: '6px', 
                                                background: member.status?.toLowerCase() === 'active' ? '#f0fdf4' : '#f1f5f9',
                                                color: member.status?.toLowerCase() === 'active' ? '#15803d' : '#64748b',
                                                border: '1px solid #e2e8f0'
                                            }}>
                                                {member.status || 'Active'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{member.role}</div>
                                    </div>
                                </div>

                                {/* Workload Indicator */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Active Projects</span>
                                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isOverloaded ? '#ef4444' : '#10b981' }}>{activeCount} <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>/ 5 max</span></span>
                                    </div>
                                    <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            height: '100%', 
                                            width: `${Math.min((activeCount / 5) * 100, 100)}%`, 
                                            background: isOverloaded ? '#ef4444' : '#10b981',
                                            borderRadius: '4px'
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StaffOverviewTab;
