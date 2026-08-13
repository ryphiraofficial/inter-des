import React, { useState } from 'react';
import { RefreshCw, User, UserPlus, Scissors, Calendar } from 'lucide-react';
import '../css/ManagerDashboard.css';
import ReassignPopover from './components/tasks/ReassignPopover';
import WorkloadSidebar from './components/tasks/WorkloadSidebar';
import ConfirmDialog from './components/tasks/ConfirmDialog';

const Tasks = ({ tasks, teamStats, staffList, onOpenAssignModal, onOpenEditTask, getPriorityColor, onReassign, onViewUpdates, onSplit }) => {
    const [showReassignDropdown, setShowReassignDropdown] = useState(null);
    const [confirmState, setConfirmState] = useState(null);

    const handleReassignSubmit = (taskId, staffMember) => {
        setConfirmState({ taskId, staffMember });
    };

    const confirmReassign = () => {
        if (confirmState) {
            onReassign(confirmState.taskId, [confirmState.staffMember._id], 'Reassigned by manager for studio optimization');
            setShowReassignDropdown(null);
            setConfirmState(null);
        }
    };

    return (
        <div className="design-tasks fade-in" style={{ paddingTop: '1rem' }}>
            <div className="dashboard-grid tasks-layout-grid">
                <div className="tasks-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingBottom: '300px' }}>
                    {tasks.filter(t => t.status !== 'Completed' && t.status !== 'Approved' && t.status !== 'Pushed to Procurement').map(task => {
                        const hasEmergency = task.dailyUpdates?.some(u => u.emergencies);
                        const overdue = task.dueDate && new Date(task.dueDate) < new Date();
                        const updatesCount = task.dailyUpdates?.length || 0;
                        const isPostDesign = ['Pending Sales Review', 'Sales Approved', 'Pending Admin Review', 'Pending Payment', 'Assigned to Procurement', 'Pending Procurement Admin Review', 'Procurement Approved'].includes(task.status);

                        return (
                            <div key={task._id} className="task-card-grid" style={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '1rem',
                                zIndex: showReassignDropdown === task._id ? 3000 : 1,
                                overflow: 'visible',
                                boxShadow: 'none'
                            }}>
                                <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>{task.title}</h4>
                                        {hasEmergency && <span className="badge-lite" style={{ background: '#fee2e2', color: '#ef4444', borderColor: '#fecaca' }}>Emergency</span>}
                                        {overdue && <span className="badge-lite" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>Overdue</span>}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={12} color="#64748b" />
                                            </div>
                                            {task.assignedTo?.map(s => s.name).join(', ') || 'Unassigned'}
                                        </div>
                                        <span style={{ color: '#e2e8f0' }}>|</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                            <Calendar size={14} />
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', minWidth: '90px', background: '#f8fafc', padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4f46e5' }}>{task.progress || 0}%</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{task.status}</div>
                                </div>

                                <div className="task-actions-group" style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: 'auto', alignItems: 'center' }}>
                                    <button className="btn-action-round" onClick={() => onViewUpdates(task)}
                                        style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                                        title={`Reports (${updatesCount})`}>
                                        <RefreshCw size={17} color="#4f46e5" />
                                    </button>

                                    {!isPostDesign && (
                                        <>
                                            <button className="btn-action-round" onClick={() => onSplit(task)}
                                                style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                                                title="Split Task">
                                                <Scissors size={17} color="#4f46e5" />
                                            </button>

                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                <button className="btn-assign-staff"
                                                    onClick={() => setShowReassignDropdown(showReassignDropdown === task._id ? null : task._id)}
                                                    style={{
                                                        background: '#f8fafc',
                                                        color: '#4f46e5',
                                                        border: '1px solid #e2e8f0', padding: '9px 16px', borderRadius: '10px',
                                                        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                                                    }}>
                                                    <UserPlus size={15} color="#4f46e5" /> Reassign
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
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <WorkloadSidebar teamStats={teamStats} />
            </div>

            {confirmState && (
                <ConfirmDialog
                    message={`Reassign this task to ${confirmState.staffMember.name}?`}
                    onConfirm={confirmReassign}
                    onCancel={() => setConfirmState(null)}
                />
            )}
        </div>
    );
};

export default Tasks;
