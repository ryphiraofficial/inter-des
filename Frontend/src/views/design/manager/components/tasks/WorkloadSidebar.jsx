import React from 'react';
import { Users, Activity } from 'lucide-react';

const WorkloadSidebar = ({ teamStats }) => {
    return (
        <div className="workload-summary">
            <div className="card-premium" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #f1f5f9', position: 'sticky', top: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={20} color="#6366f1" /> Studio Bandwidth
                    </h3>
                    <Activity size={18} color="#10b981" />
                </div>
                <div className="team-load-list">
                    {teamStats.map(member => (
                        <div key={member._id} className="load-row" style={{ padding: '1.25rem 0', borderBottom: '1px solid #f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{member.name || member.fullName || 'Staff Member'}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{member.role}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        background: member.pendingTasks > 4 ? '#fee2e2' : '#f0fdf4',
                                        color: member.pendingTasks > 4 ? '#ef4444' : '#10b981'
                                    }}>
                                        {member.pendingTasks} Projects
                                    </span>
                                </div>
                            </div>
                            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min((member.pendingTasks / 6) * 100, 100)}%`, background: member.pendingTasks > 4 ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: '10px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkloadSidebar;
