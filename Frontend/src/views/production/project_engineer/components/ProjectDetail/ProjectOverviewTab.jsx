import React from 'react';
import { Info, User, Calendar, TrendingUp, CheckSquare, Users, UserX } from 'lucide-react';

const ProjectOverviewTab = ({ project, allTasks, myTasks, user, setReplaceData, setShowReplaceModal }) => {
    return (
        <div className="eng-tab-content">
            <div className="eng-overview-grid">
                {/* Project info */}
                <div className="eng-section-card">
                    <div className="eng-section-header">
                        <div className="eng-section-title"><Info size={16}/>Project Info</div>
                    </div>
                    <div className="eng-info-rows">
                        {[
                            { key: 'Client', value: project.clientId?.name || '—', icon: <User size={15} style={{ color: '#6366f1' }} /> },
                            { key: 'Start Date', value: project.startDate ? new Date(project.startDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—', icon: <Calendar size={15} style={{ color: '#10b981' }} /> },
                            { key: 'End Date', value: project.endDate ? new Date(project.endDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—', icon: <Calendar size={15} style={{ color: '#f59e0b' }} /> },
                            { key: 'Status', value: project.status, icon: <TrendingUp size={15} style={{ color: '#06b6d4' }} /> },
                        ].map((item)=>(
                            <div key={item.key} className="eng-info-row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="eng-row-icon-box">{item.icon}</div>
                                    <span className="eng-info-label">{item.key}</span>
                                </div>
                                <span className="eng-info-value">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress */}
                <div className="eng-section-card">
                    <div className="eng-section-header">
                        <div className="eng-section-title"><CheckSquare size={16}/>Progress</div>
                    </div>
                    <div className="eng-progress-section">
                        <div className="eng-progress-label">
                            <span>Overall completion</span><span>{project.progress||0}%</span>
                        </div>
                        <div className="eng-progress-track-glowing">
                            <div className="eng-progress-fill-glowing" style={{ width:`${project.progress||0}%` }}/>
                        </div>
                        <div className="eng-overview-stats">
                            {[
                                { label: 'Total Tasks', value: allTasks.length, bg: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', color: '#4f46e5' },
                                { label: 'My Tasks', value: myTasks.length, bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#2563eb' },
                                { label: 'Done', value: allTasks.filter(t=>['Completed','Approved'].includes(t.status)).length, bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', color: '#059669' }
                            ].map((stat)=>(
                                <div key={stat.label} className="eng-ov-stat-card" style={{ background: stat.bg }}>
                                    <span style={{ color: stat.color }}>{stat.value}</span>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="eng-section-card">
                    <div className="eng-section-header">
                        <div className="eng-section-title"><Users size={16}/>Team</div>
                    </div>
                    <div className="eng-team-list">
                        {[
                            { key: 'Project Manager', value: project.projectManager, grad: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', initial: 'PM' },
                            { key: 'Project Engineer', value: project.projectEngineer, grad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', initial: 'PE' },
                            { key: 'Site Engineer', value: project.siteEngineer, grad: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', initial: 'SE' },
                            { key: 'Site Supervisor', value: project.siteSupervisor, grad: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', initial: 'SS' },
                        ].filter(item => item.value).map((item)=>(
                            <div key={item.key} className="eng-team-row">
                                <div className="eng-team-avatar" style={{ background: item.grad }}>
                                    {item.value.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || item.initial}
                                </div>
                                <div className="eng-team-details">
                                    <span className="eng-team-name">{item.value.fullName}</span>
                                    <span className="eng-team-role">{item.key}</span>
                                </div>
                                {((user?.role === 'Project Engineer' && (item.key === 'Site Engineer' || item.key === 'Site Supervisor')) || 
                                  (user?.role === 'Site Engineer' && item.key === 'Site Supervisor')) && (
                                    <button 
                                        className="eng-replace-btn"
                                        title="Request Replacement"
                                        onClick={() => {
                                            setReplaceData({
                                                staffType: item.key,
                                                currentStaffId: item.value._id,
                                                currentStaffName: item.value.fullName,
                                                reason: ''
                                            });
                                            setShowReplaceModal(true);
                                        }}
                                    >
                                        <UserX size={14}/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverviewTab;
