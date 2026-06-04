import { useState, useEffect } from 'react';
import { useToast } from '../../../../models/context/ToastContext';
import { 
    useGetEngineerProjectTasksQuery, 
    useGetProductionStaffQuery, 
    useAssignTeamMutation, 
    useCreatePMTaskMutation, 
    useAssignTaskMutation, 
    useApproveTaskMutation 
} from '../../../../store/api/productionApi';

export const useProjectTasksAssignment = (project, onProjectUpdate) => {
    const { showToast } = useToast();
    
    // Core states
    const [activeTab, setActiveTab] = useState('tasks');
    
    // Loading/Submitting states
    const [updatingTeam, setUpdatingTeam] = useState(false);
    const [creatingTask, setCreatingTask] = useState(false);
    const [actioningTaskId, setActioningTaskId] = useState(null);

    // Form states
    const [teamForm, setTeamForm] = useState({
        projectEngineer: project?.projectEngineer?._id || project?.projectEngineer || '',
        siteEngineer: project?.siteEngineer?._id || project?.siteEngineer || '',
        siteSupervisor: project?.siteSupervisor?._id || project?.siteSupervisor || ''
    });

    const [newTaskForm, setNewTaskForm] = useState({
        title: '',
        description: '',
        assignedTo: '',
        stage: 'PE', // PM | PE | SE | SS
        priority: 'Medium' // Low | Medium | High | Urgent
    });

    const { data: tasksRes, isLoading: loadingTasks, refetch: fetchTasks } = useGetEngineerProjectTasksQuery(project?._id, { skip: !project?._id });
    const { data: staffRes } = useGetProductionStaffQuery(undefined, { skip: !project?._id });
    const [assignTeam] = useAssignTeamMutation();
    const [createTask] = useCreatePMTaskMutation();
    const [assignTask] = useAssignTaskMutation();
    const [approveTask] = useApproveTaskMutation();

    const tasks = tasksRes?.success ? tasksRes.data : [];
    const staff = staffRes?.success ? staffRes.data : [];

    const getFilteredStaff = (stageValue) => {
        let assignedId = null;
        if (stageValue === 'PE') assignedId = project?.projectEngineer?._id || project?.projectEngineer;
        else if (stageValue === 'SE') assignedId = project?.siteEngineer?._id || project?.siteEngineer;
        else if (stageValue === 'SS') assignedId = project?.siteSupervisor?._id || project?.siteSupervisor;
        else if (stageValue === 'PM') assignedId = project?.projectManager?._id || project?.projectManager;

        if (assignedId) {
            const assignedIdStr = assignedId.toString();
            return staff.filter(s => s._id === assignedIdStr);
        }
        return [];
    };

    const handleUpdateTeam = async (e) => {
        e.preventDefault();
        try {
            setUpdatingTeam(true);
            await assignTeam({
                projectId: project._id,
                projectEngineer: teamForm.projectEngineer || null,
                siteEngineer: teamForm.siteEngineer || null,
                siteSupervisor: teamForm.siteSupervisor || null
            }).unwrap();

            showToast('Project team assignments updated successfully');
            if (onProjectUpdate) onProjectUpdate();
        } catch (err) {
            console.error('Update team error:', err);
            showToast(err.data?.message || err.message || 'Failed to update project team', 'error');
        } finally {
            setUpdatingTeam(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskForm.title.trim()) {
            showToast('Please provide a task title', 'warning');
            return;
        }

        try {
            setCreatingTask(true);
            await createTask({ ...newTaskForm, projectId: project._id }).unwrap();

            showToast('New production task created and assigned successfully');
            setNewTaskForm({ title: '', description: '', assignedTo: '', stage: 'PE', priority: 'Medium' });
            setActiveTab('tasks');
            fetchTasks();
        } catch (err) {
            console.error('Create task error:', err);
            showToast(err.data?.message || err.message || 'Failed to create task', 'error');
        } finally {
            setCreatingTask(false);
        }
    };

    const handleReassignTask = async (taskId, newAssigneeId) => {
        try {
            setActioningTaskId(taskId);
            await assignTask({ taskId, assignedTo: newAssigneeId || null }).unwrap();
            showToast('Task reassigned successfully');
            fetchTasks();
        } catch (err) {
            console.error('Reassign task error:', err);
            showToast(err.data?.message || err.message || 'Failed to reassign task', 'error');
        } finally {
            setActioningTaskId(null);
        }
    };

    const handleApproveTask = async (taskId) => {
        try {
            setActioningTaskId(taskId);
            await approveTask(taskId).unwrap();
            showToast('Task approved successfully');
            fetchTasks();
        } catch (err) {
            console.error('Approve task error:', err);
            showToast(err.data?.message || err.message || 'Failed to approve task', 'error');
        } finally {
            setActioningTaskId(null);
        }
    };

    const projectEngineers = staff.filter(s => s.role === 'Project Engineer');
    const siteEngineers = staff.filter(s => s.role === 'Site Engineer');
    const siteSupervisors = staff.filter(s => s.role === 'Site Supervisor');

    return {
        tasks, staff, loadingTasks,
        activeTab, setActiveTab,
        updatingTeam, creatingTask, actioningTaskId,
        teamForm, setTeamForm,
        newTaskForm, setNewTaskForm,
        getFilteredStaff, handleUpdateTeam, handleCreateTask,
        handleReassignTask, handleApproveTask,
        projectEngineers, siteEngineers, siteSupervisors
    };
};
