import React, { useState, useEffect } from 'react';
import { 
    Users, 
    UserPlus, 
    CheckCircle, 
    Plus, 
    Calendar, 
    AlertCircle, 
    Check, 
    Loader2, 
    ShieldAlert,
    Briefcase,
    ChevronRight,
    Edit3
} from 'lucide-react';
import { productionAPI, apiCall, BASE_IMAGE_URL } from '../../../models/api';
import { useToast } from '../../../models/context/ToastContext';

const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ProjectTasksAssignment = ({ project, onProjectUpdate }) => {
    const { showToast } = useToast();
    
    // Core states
    const [tasks, setTasks] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'new-task' | 'team'
    
    // Loading/Submitting states
    const [updatingTeam, setUpdatingTeam] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);
    const [actioningTaskId, setActioningTaskId] = useState(null);

    // Form states
    const [teamForm, setTeamForm] = useState({
        projectEngineer: project.projectEngineer?._id || '',
        siteEngineer: project.siteEngineer?._id || '',
        siteSupervisor: project.siteSupervisor?._id || ''
    });

    const [newTaskForm, setNewTaskForm] = useState({
        title: '',
        description: '',
        assignedTo: '',
        stage: 'PE', // PM | PE | SE | SS
        priority: 'Medium' // Low | Medium | High | Urgent
    });

    // Run fetches
    useEffect(() => {
        fetchTasks();
        fetchStaff();
    }, [project._id]);

    const fetchTasks = async () => {
        try {
            setLoadingTasks(true);
            const res = await apiCall(`/production-management/tasks/project/${project._id}`);
            if (res.success) {
                setTasks(res.data || []);
            }
        } catch (err) {
            console.error('Error loading project tasks:', err);
        } finally {
            setLoadingTasks(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await productionAPI.getProductionStaff();
            if (res.success) {
                setStaff(res.data || []);
            }
        } catch (err) {
            console.error('Error loading staff list:', err);
        }
    };

    // Filter staff list based on role/stage selection
    const getFilteredStaff = (stageValue) => {
        let roleName = '';
        if (stageValue === 'PE') roleName = 'Project Engineer';
        else if (stageValue === 'SE') roleName = 'Site Engineer';
        else if (stageValue === 'SS') roleName = 'Site Supervisor';
        else return staff; // PM or fallback sees everyone

        return staff.filter(s => s.role === roleName);
    };

    // Team update handler
    const handleUpdateTeam = async (e) => {
        e.preventDefault();
        try {
            setUpdatingTeam(true);
            const res = await apiCall(`/production-management/projects/${project._id}/assign-team`, {
                method: 'PUT',
                body: JSON.stringify({
                    projectEngineer: teamForm.projectEngineer || null,
                    siteEngineer: teamForm.siteEngineer || null,
                    siteSupervisor: teamForm.siteSupervisor || null
                })
            });

            if (res.success) {
                showToast('Project team assignments updated successfully');
                if (onProjectUpdate) onProjectUpdate();
            } else {
                showToast(res.message || 'Failed to update team assignments', 'error');
            }
        } catch (err) {
            console.error('Update team error:', err);
            showToast('Failed to update project team', 'error');
        } finally {
            setUpdatingTeam(false);
        }
    };

    // Task creation handler
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskForm.title.trim()) {
            showToast('Please provide a task title', 'warning');
            return;
        }

        try {
            setCreatingTask(true);
            const res = await apiCall('/production-management/tasks/create', {
                method: 'POST',
                body: JSON.stringify({
                    ...newTaskForm,
                    projectId: project._id
                })
            });

            if (res.success) {
                showToast('New production task created and assigned successfully');
                // Reset form
                setNewTaskForm({
                    title: '',
                    description: '',
                    assignedTo: '',
                    stage: 'PE',
                    priority: 'Medium'
                });
                setActiveTab('tasks');
                fetchTasks();
            } else {
                showToast(res.message || 'Failed to create task', 'error');
            }
        } catch (err) {
            console.error('Create task error:', err);
            showToast('Failed to create task', 'error');
        } finally {
            setCreatingTask(false);
        }
    };

    // Reassign task assignee handler
    const handleReassignTask = async (taskId, newAssigneeId) => {
        try {
            setActioningTaskId(taskId);
            const res = await apiCall(`/production-management/tasks/${taskId}/assign`, {
                method: 'PUT',
                body: JSON.stringify({ assignedTo: newAssigneeId || null })
            });

            if (res.success) {
                showToast('Task reassigned successfully');
                fetchTasks();
            } else {
                showToast(res.message || 'Failed to reassign task', 'error');
            }
        } catch (err) {
            console.error('Reassign task error:', err);
            showToast('Failed to reassign task', 'error');
        } finally {
            setActioningTaskId(null);
        }
    };

    // Approve task handler
    const handleApproveTask = async (taskId) => {
        try {
            setActioningTaskId(taskId);
            const res = await apiCall(`/production-management/tasks/${taskId}/approve`, {
                method: 'PUT'
            });

            if (res.success) {
                showToast('Task approved successfully');
                fetchTasks();
            } else {
                showToast(res.message || 'Failed to approve task', 'error');
            }
        } catch (err) {
            console.error('Approve task error:', err);
            showToast('Failed to approve task', 'error');
        } finally {
            setActioningTaskId(null);
        }
    };

    // Grouping staff by role
    const projectEngineers = staff.filter(s => s.role === 'Project Engineer');
    const siteEngineers = staff.filter(s => s.role === 'Site Engineer');
    const siteSupervisors = staff.filter(s => s.role === 'Site Supervisor');

    // Priority theme helper
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'Urgent': return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' };
            case 'High': return { background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5' };
            case 'Medium': return { background: '#f0f9ff', color: '#0284c7', border: '1px solid #e0f2fe' };
            default: return { background: '#f6f8fa', color: '#57606a', border: '1px solid #d0d7de' };
        }
    };

    // Status theme helper
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return { background: '#ecfdf5', color: '#059669' };
            case 'Approved': return { background: '#f0fdf4', color: '#16a34a', fontWeight: 'bold' };
            case 'In Progress': return { background: '#eff6ff', color: '#2563eb' };
            default: return { background: '#fffbeb', color: '#d97706' }; // Pending
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Component Header Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={18} color="#4f46e5" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Task Assignment & Team Roles</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => setActiveTab('tasks')}
                        style={{ 
                            padding: '6px 14px', 
                            fontSize: '0.85rem', 
                            borderRadius: '8px', 
                            border: 'none', 
                            background: activeTab === 'tasks' ? '#4f46e5' : 'transparent', 
                            color: activeTab === 'tasks' ? 'white' : '#64748b', 
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Project Tasks ({tasks.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('new-task')}
                        style={{ 
                            padding: '6px 14px', 
                            fontSize: '0.85rem', 
                            borderRadius: '8px', 
                            border: 'none', 
                            background: activeTab === 'new-task' ? '#4f46e5' : 'transparent', 
                            color: activeTab === 'new-task' ? 'white' : '#64748b', 
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Plus size={14} /> Create Task
                    </button>
                    <button 
                        onClick={() => setActiveTab('team')}
                        style={{ 
                            padding: '6px 14px', 
                            fontSize: '0.85rem', 
                            borderRadius: '8px', 
                            border: 'none', 
                            background: activeTab === 'team' ? '#4f46e5' : 'transparent', 
                            color: activeTab === 'team' ? 'white' : '#64748b', 
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                    >
                        <Users size={14} /> Assign Team
                    </button>
                </div>
            </div>

            {/* Component Body Panels */}
            <div style={{ padding: '1.5rem' }}>
                
                {/* [Panel 1] Tasks Board */}
                {activeTab === 'tasks' && (
                    <div>
                        {loadingTasks ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0', gap: '8px', color: '#64748b' }}>
                                <Loader2 className="pm-spin" size={20} /> Loading tasks...
                            </div>
                        ) : tasks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
                                <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem', marginBottom: '4px' }}>No Tasks Registered</h4>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>No task has been assigned for this production project yet.</p>
                                <button 
                                    onClick={() => setActiveTab('new-task')}
                                    style={{ 
                                        padding: '8px 16px', 
                                        background: '#4f46e5', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '8px', 
                                        fontWeight: 600, 
                                        fontSize: '0.85rem', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Add First Task
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                                {tasks.map(t => {
                                    const isActioning = actioningTaskId === t._id;
                                    
                                    return (
                                        <div key={t._id} style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                                            
                                            {/* Priority & Stage Badges */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', ...getPriorityStyle(t.priority) }}>
                                                    {t.priority}
                                                </span>
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#475569', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                                        Stage: {t.stage}
                                                    </span>
                                                    <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, ...getStatusStyle(t.status) }}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Task Detail */}
                                            <div style={{ marginBottom: '1rem' }}>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{t.title}</h4>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{t.description || 'No description provided.'}</p>
                                                
                                                {/* Display Completed Work Preview for PM if task has updates with images */}
                                                {t.updates?.some(up => up.images?.length > 0) && (
                                                    <div style={{ marginTop: '0.75rem', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>📸 Completion Photos & Logs</span>
                                                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '4px' }}>
                                                            {t.updates.flatMap((up, uIdx) => 
                                                                (up.images || []).map((img, imgIdx) => (
                                                                    <div key={`${uIdx}-${imgIdx}`} style={{ position: 'relative', width: '60px', height: '45px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, border: '1px solid #cbd5e1' }} title={up.note || 'Site image'}>
                                                                        <img src={getImageUrl(img)} alt="Site" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                        {t.updates.slice().reverse().find(u => u.note)?.note && (
                                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.725rem', color: '#64748b', fontStyle: 'italic', lineHeight: 1.3 }}>
                                                                "{t.updates.slice().reverse().find(u => u.note).note}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assignment Dropdown & Approval */}
                                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    
                                                    {/* Assign To Dropdown Selector */}
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>ASSIGNED TO</label>
                                                        <div style={{ 
                                                            padding: '8px 10px', 
                                                            background: '#f8fafc', 
                                                            border: '1px solid #e2e8f0', 
                                                            borderRadius: '6px', 
                                                            fontSize: '0.825rem', 
                                                            color: '#334155', 
                                                            fontWeight: 500 
                                                        }}>
                                                            {t.assignedTo ? t.assignedTo.fullName : '-- Unassigned --'}
                                                        </div>
                                                    </div>

                                                    {/* If task status is Completed/Pending PM Approval, allow Approve action */}
                                                    {t.status === 'Completed' && (
                                                        <button 
                                                            disabled={isActioning}
                                                            onClick={() => handleApproveTask(t._id)}
                                                            style={{ 
                                                                width: '100%', 
                                                                padding: '8px', 
                                                                background: '#10b981', 
                                                                color: 'white', 
                                                                border: 'none', 
                                                                borderRadius: '6px', 
                                                                fontWeight: 600, 
                                                                fontSize: '0.8rem', 
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                marginTop: '4px'
                                                            }}
                                                        >
                                                            {isActioning ? <Loader2 className="pm-spin" size={14} /> : <><CheckCircle size={14} /> Approve Work</>}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* [Panel 2] Create New Task */}
                {activeTab === 'new-task' && (
                    <form onSubmit={handleCreateTask} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                            Add New Production Task
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            
                            {/* Title */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Task Title *</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter task title (e.g. Wall Plastering completion)"
                                    value={newTaskForm.title}
                                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none' }}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Description</label>
                                <textarea 
                                    rows="3"
                                    placeholder="Enter detailed description or requirements"
                                    value={newTaskForm.description}
                                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', resize: 'none' }}
                                />
                            </div>

                            {/* Stage Selector */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Stage / Staff Category</label>
                                <select 
                                    value={newTaskForm.stage}
                                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, stage: e.target.value, assignedTo: '' }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                                >
                                    <option value="PE">Project Engineer (PE)</option>
                                    <option value="SE">Site Engineer (SE)</option>
                                    <option value="SS">Site Supervisor (SS)</option>
                                    <option value="PM">Project Manager (PM)</option>
                                </select>
                            </div>

                            {/* Assign To (Depends on chosen Stage) */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Assign Staff Member</label>
                                <select 
                                    value={newTaskForm.assignedTo}
                                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                                >
                                    <option value="">-- Select Assignee --</option>
                                    {getFilteredStaff(newTaskForm.stage).map(s => (
                                        <option key={s._id} value={s._id}>{s.fullName} ({s.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Task Priority</label>
                                <select 
                                    value={newTaskForm.priority}
                                    onChange={(e) => setNewTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', outline: 'none', background: 'white' }}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1.5rem' }}>
                            <button 
                                type="button" 
                                onClick={() => setActiveTab('tasks')}
                                style={{ padding: '10px 20px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={creatingTask}
                                style={{ 
                                    padding: '10px 20px', 
                                    background: '#4f46e5', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {creatingTask ? <Loader2 className="pm-spin" size={16} /> : <><Plus size={16} /> Assign & Create Task</>}
                            </button>
                        </div>
                    </form>
                )}

                {/* [Panel 3] Assign/Update Team */}
                {activeTab === 'team' && (
                    <form onSubmit={handleUpdateTeam} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#1e293b' }}>
                            Project Active Team Assignment
                        </h4>
                        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                            Assign or update the main team leads and staff members managing this active production workflow.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
                            
                            {/* Project Engineer */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                                    <UserPlus size={14} color="#3b82f6" /> Project Engineer (PE)
                                </label>
                                <select 
                                    value={teamForm.projectEngineer}
                                    onChange={(e) => setTeamForm(prev => ({ ...prev, projectEngineer: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {projectEngineers.map(e => (
                                        <option key={e._id} value={e._id}>{e.fullName} ({e.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Site Engineer */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                                    <UserPlus size={14} color="#10b981" /> Site Engineer (SE)
                                </label>
                                <select 
                                    value={teamForm.siteEngineer}
                                    onChange={(e) => setTeamForm(prev => ({ ...prev, siteEngineer: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {siteEngineers.map(e => (
                                        <option key={e._id} value={e._id}>{e.fullName} ({e.email})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Site Supervisor */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                                    <UserPlus size={14} color="#f59e0b" /> Site Supervisor (SS)
                                </label>
                                <select 
                                    value={teamForm.siteSupervisor}
                                    onChange={(e) => setTeamForm(prev => ({ ...prev, siteSupervisor: e.target.value }))}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                                >
                                    <option value="">-- Unassigned --</option>
                                    {siteSupervisors.map(e => (
                                        <option key={e._id} value={e._id}>{e.fullName} ({e.email})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                            <button 
                                type="button" 
                                onClick={() => setActiveTab('tasks')}
                                style={{ padding: '10px 20px', background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={updatingTeam}
                                style={{ 
                                    padding: '10px 20px', 
                                    background: '#4f46e5', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    fontSize: '0.875rem', 
                                    fontWeight: 600, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {updatingTeam ? <Loader2 className="pm-spin" size={16} /> : <><Check size={16} /> Save Team Assignment</>}
                            </button>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};

export default ProjectTasksAssignment;
