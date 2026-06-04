import React from 'react';

const StaffOverviewTab = ({ staffList, tasks, setSelectedStaff, setShowStaffTasksModal }) => {
    return (
        <div className="fade-in" style={{ paddingTop: '1rem' }}>
            <div className="card-premium" style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px -5px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {staffList.map(member => {
                        const activeCount = tasks.filter(t => t.assignedTo?.some(s => s._id === member._id) && !['Completed', 'Approved', 'Pushed to Procurement'].includes(t.status)).length;
                        const isOverloaded = activeCount > 3;
                        
                        return (
                            <div 
                                key={member._id} 
                                style={{ 
                                    background: '#f8fafc', 
                                    borderRadius: '16px', 
                                    padding: '1.5rem', 
                                    border: `1px solid ${isOverloaded ? '#fee2e2' : '#e2e8f0'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 25px -10px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.borderColor = isOverloaded ? '#fca5a5' : '#cbd5e1';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = isOverloaded ? '#fee2e2' : '#e2e8f0';
                                }}
                                onClick={() => { setSelectedStaff(member); setShowStaffTasksModal(true); }}
                            >
                                {/* Status Indicator */}
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isOverloaded ? '#ef4444' : '#10b981' }}></div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {/* Avatar */}
                                    <div style={{ 
                                        width: '48px', height: '48px', 
                                        borderRadius: '14px', 
                                        background: isOverloaded ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
                                        color: isOverloaded ? '#ef4444' : '#10b981', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontSize: '1.2rem', fontWeight: 800,
                                        border: `1px solid ${isOverloaded ? '#fecaca' : '#bbf7d0'}`
                                    }}>
                                        {(member.name || 'S').charAt(0).toUpperCase()}
                                    </div>
                                    
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{member.name}</h4>
                                            <span style={{ 
                                                fontSize: '0.7rem', fontWeight: 800, 
                                                padding: '4px 8px', borderRadius: '8px', 
                                                background: member.status?.toLowerCase() === 'active' ? '#dcfce7' : '#f1f5f9',
                                                color: member.status?.toLowerCase() === 'active' ? '#15803d' : '#64748b'
                                            }}>
                                                {member.status || 'Active'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{member.role}</div>
                                    </div>
                                </div>

                                {/* Workload Indicator */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Active Projects</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isOverloaded ? '#ef4444' : '#10b981' }}>{activeCount} <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 500 }}>/ 5 max</span></span>
                                    </div>
                                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            height: '100%', 
                                            width: `${Math.min((activeCount / 5) * 100, 100)}%`, 
                                            background: isOverloaded ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #10b981, #34d399)',
                                            borderRadius: '10px',
                                            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
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
