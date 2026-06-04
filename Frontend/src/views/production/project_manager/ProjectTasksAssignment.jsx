import React, { useState } from 'react';
import { Users, Plus, Briefcase, Lock, LockOpen } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/slices/authSlice';
import { useProjectTasksAssignment } from './hooks/useProjectTasksAssignment';
import { useUnlockProjectMutation, useRequestUnlockProjectMutation } from '../../../store/api/productionApi';
import TasksBoard from './components/ProjectTasksAssignment/TasksBoard';
import CreateTaskForm from './components/ProjectTasksAssignment/CreateTaskForm';
import AssignTeamForm from './components/ProjectTasksAssignment/AssignTeamForm';

const ProjectTasksAssignment = ({ project, onProjectUpdate }) => {
    const {
        tasks, loadingTasks,
        activeTab, setActiveTab,
        updatingTeam, creatingTask, actioningTaskId,
        teamForm, setTeamForm,
        newTaskForm, setNewTaskForm,
        getFilteredStaff, handleUpdateTeam, handleCreateTask,
        handleApproveTask,
        projectEngineers, siteEngineers, siteSupervisors
    } = useProjectTasksAssignment(project, onProjectUpdate);

    const currentUser = useSelector(selectUser);
    const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Super Admin';
    const isLocked = project?.status === 'Admin Approved';

    const [unlockProject, { isLoading: unlocking }] = useUnlockProjectMutation();
    const [requestUnlockProject, { isLoading: requestingUnlock }] = useRequestUnlockProjectMutation();
    const [unlockError, setUnlockError] = useState(null);
    const [requestSent, setRequestSent] = useState(false);

    const handleUnlock = async () => {
        setUnlockError(null);
        try {
            await unlockProject(project._id).unwrap();
            if (onProjectUpdate) onProjectUpdate();
        } catch (err) {
            setUnlockError(err?.data?.message || 'Failed to unlock project.');
        }
    };

    const handleRequestUnlock = async () => {
        setUnlockError(null);
        try {
            await requestUnlockProject(project._id).unwrap();
            setRequestSent(true);
        } catch (err) {
            setUnlockError(err?.data?.message || 'Failed to send unlock request.');
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

            {/* Header bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={18} color="#4f46e5" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Task Assignment &amp; Team Roles</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {/* Project Tasks tab — always enabled (read-only view) */}
                    <button
                        onClick={() => setActiveTab('tasks')}
                        style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '8px', border: 'none', background: activeTab === 'tasks' ? '#4f46e5' : 'transparent', color: activeTab === 'tasks' ? 'white' : '#64748b', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Project Tasks ({tasks.length})
                    </button>

                    {/* Create Task — disabled when locked */}
                    <button
                        onClick={() => !isLocked && setActiveTab('new-task')}
                        title={isLocked ? 'Project is locked — Admin has approved this project' : ''}
                        className={isLocked ? 'pm-locked-btn' : ''}
                        style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '8px', border: 'none', background: activeTab === 'new-task' ? '#4f46e5' : 'transparent', color: activeTab === 'new-task' ? 'white' : '#64748b', fontWeight: 600, cursor: isLocked ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Plus size={14} /> Create Task
                    </button>

                    {/* Assign Team — disabled when locked */}
                    <button
                        onClick={() => !isLocked && setActiveTab('team')}
                        title={isLocked ? 'Project is locked — Admin has approved this project' : ''}
                        className={isLocked ? 'pm-locked-btn' : ''}
                        style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '8px', border: 'none', background: activeTab === 'team' ? '#4f46e5' : 'transparent', color: activeTab === 'team' ? 'white' : '#64748b', fontWeight: 600, cursor: isLocked ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        <Users size={14} /> Assign Team
                    </button>
                </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
                {/* 🔒 Locked banner */}
                {isLocked && (
                    <div className="pm-locked-banner" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span className="pm-locked-banner-icon"><Lock size={18} color="#b45309" /></span>
                            <div className="pm-locked-banner-text">
                                <span className="pm-locked-banner-title">🔒 Project Locked — Admin Approved</span>
                                <span className="pm-locked-banner-subtitle">This project has been marked complete by Admin. No further changes are allowed.</span>
                            </div>
                        </div>

                        {/* Unlock button — Admin only */}
                        {isAdmin ? (
                            <button
                                onClick={handleUnlock}
                                disabled={unlocking}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #d97706',
                                    background: unlocking ? '#fef3c7' : '#fffbeb', color: '#92400e',
                                    fontSize: '0.8rem', fontWeight: 700, cursor: unlocking ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0
                                }}
                                onMouseOver={e => { if (!unlocking) e.currentTarget.style.background = '#fef3c7'; }}
                                onMouseOut={e => { if (!unlocking) e.currentTarget.style.background = '#fffbeb'; }}
                            >
                                <LockOpen size={14} />
                                {unlocking ? 'Unlocking...' : 'Unlock Project'}
                            </button>
                        ) : (
                            <button
                                onClick={handleRequestUnlock}
                                disabled={requestingUnlock || requestSent}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #d97706',
                                    background: (requestingUnlock || requestSent) ? '#fef3c7' : '#fffbeb', color: '#92400e',
                                    fontSize: '0.8rem', fontWeight: 700, cursor: (requestingUnlock || requestSent) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.15s', whiteSpace: 'nowrap', flexShrink: 0
                                }}
                                onMouseOver={e => { if (!requestingUnlock && !requestSent) e.currentTarget.style.background = '#fef3c7'; }}
                                onMouseOut={e => { if (!requestingUnlock && !requestSent) e.currentTarget.style.background = '#fffbeb'; }}
                            >
                                <LockOpen size={14} />
                                {requestSent ? 'Request Sent ✓' : requestingUnlock ? 'Sending...' : 'Request Unlock'}
                            </button>
                        )}
                    </div>
                )}

                {unlockError && (
                    <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#dc2626' }}>
                        {unlockError}
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <TasksBoard
                        tasks={tasks}
                        loadingTasks={loadingTasks}
                        setActiveTab={setActiveTab}
                        actioningTaskId={actioningTaskId}
                        handleApproveTask={handleApproveTask}
                        isLocked={isLocked}
                    />
                )}

                {activeTab === 'new-task' && !isLocked && (
                    <CreateTaskForm
                        handleCreateTask={handleCreateTask}
                        newTaskForm={newTaskForm}
                        setNewTaskForm={setNewTaskForm}
                        creatingTask={creatingTask}
                        setActiveTab={setActiveTab}
                        getFilteredStaff={getFilteredStaff}
                    />
                )}

                {activeTab === 'team' && !isLocked && (
                    <AssignTeamForm
                        handleUpdateTeam={handleUpdateTeam}
                        teamForm={teamForm}
                        setTeamForm={setTeamForm}
                        updatingTeam={updatingTeam}
                        setActiveTab={setActiveTab}
                        projectEngineers={projectEngineers}
                        siteEngineers={siteEngineers}
                        siteSupervisors={siteSupervisors}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectTasksAssignment;
