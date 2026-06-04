import React, { useState } from 'react';
import { RefreshCw, User, UserPlus, Scissors, Calendar } from 'lucide-react';
import '../css/ManagerDashboard.css';
import ReassignPopover from './components/tasks/ReassignPopover';
import WorkloadSidebar from './components/tasks/WorkloadSidebar';

const Tasks = ({ tasks, teamStats, staffList, onOpenAssignModal, onOpenEditTask, getPriorityColor, onReassign, onViewUpdates, onSplit }) => {
    const [showReassignDropdown, setShowReassignDropdown] = useState(null);

    const handleReassignSubmit = (taskId, staffMember) => {
        if (window.confirm(`Reassign this task to ${staffMember.name}?`)) {
            onReassign(taskId, [staffMember._id], 'Reassigned by manager for studio optimization');
            setShowReassignDropdown(null);
        }
    };

    return (
        <div className="design-tasks fade-in" style={{ paddingTop: '1rem' }}>
            <div className="dashboard-grid tasks-layout-grid">
                <div className="tasks-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '300px' }}>
                    {tasks.filter(t => t.status !== 'Completed' && t.status !== 'Approved' && t.status !== 'Pushed to Procurement').map(task => {
                        const hasEmergency = task.dailyUpdates?.some(u => u.emergencies);
                        const overdue = task.dueDate && new Date(task.dueDate) < new Date();
                        const updatesCount = task.dailyUpdates?.length || 0;

                        return (
                            <div key={task._id} className="card-premium task-card-grid" style={{
                                position: 'relative',
                                background: '#fff',
                                border: `1px solid ${hasEmergency ? '#fee2e2' : '#f1f5f9'}`,
                                borderRadius: '16px',
                                padding: '1rem 1.25rem',
                                alignItems: 'center',
                                zIndex: showReassignDropdown === task._id ? 3000 : 1,
                                overflow: 'visible',
                                boxShadow: '0 2px 10px -3px rgba(0,0,0,0.03)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'default'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px -5px rgba(0,0,0,0.06)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px -3px rgba(0,0,0,0.03)'; }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, width: '6px', height: '100%', background: hasEmergency ? '#ef4444' : overdue ? '#ef4444' : getPriorityColor(task.priority) }}></div>

                                <div style={{ flex: 1, minWidth: '220px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{task.title}</h4>
                                        {hasEmergency && <span className="badge-lite" style={{ background: '#fee2e2', color: '#ef4444', borderColor: '#fecaca' }}>Emergency</span>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={12} color="#64748b" />
                                            </div>
                                            {task.assignedTo?.map(s => s.name).join(', ') || 'Unassigned'}
                                        </div>
                                        <span style={{ color: '#e2e8f0' }}>|</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: overdue ? '#ef4444' : '#64748b', fontWeight: overdue ? 700 : 500 }}>
                                            <Calendar size={14} />
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', minWidth: '100px', background: '#f8fafc', padding: '10px 15px', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4f46e5' }}>{task.progress || 0}%</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{task.status}</div>
                                </div>

                                <div className="task-actions-group" style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-action-round" onClick={() => onViewUpdates(task)}
                                        style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        title={`Reports (${updatesCount})`}>
                                        <RefreshCw size={18} color="#6366f1" />
                                    </button>

                                    <button className="btn-action-round" onClick={() => onSplit(task)}
                                        style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        title="Split Task">
                                        <Scissors size={18} color="#8b5cf6" />
                                    </button>

                                    <div style={{ position: 'relative' }}>
                                        <button className="btn-assign-staff"
                                            onClick={() => setShowReassignDropdown(showReassignDropdown === task._id ? null : task._id)}
                                            style={{
                                                background: showReassignDropdown === task._id ? '#4f46e5' : '#eff6ff',
                                                color: showReassignDropdown === task._id ? 'white' : '#2563eb',
                                                border: '1px solid #dbeafe', padding: '10px 18px', borderRadius: '12px',
                                                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
                                            }}>
                                            <UserPlus size={16} /> Reassign
                                        </button>

                                        {showReassignDropdown === task._id && (
                                            <ReassignPopover
                                                task={task}
                                                teamStats={teamStats}
                                                onClose={() => setShowReassignDropdown(null)}
                                                onSubmit={handleReassignSubmit}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <WorkloadSidebar teamStats={teamStats} />
            </div>
        </div>
    );
};

export default Tasks;
