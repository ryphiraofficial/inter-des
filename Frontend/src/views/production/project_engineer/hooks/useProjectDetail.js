import { useState } from 'react';
import { 
    useGetEngineerProjectByIdQuery,
    useGetEngineerProjectTasksQuery,
    useGetEngineerProjectActivityQuery,
    useGetSiteTeamQuery,
    useGetSupervisorsQuery,
    useCreateEngineerSubtaskMutation,
    useCreatePMTaskMutation, // Same endpoint used by engineer
    useRequestStaffReplacementMutation,
    useAssignEngineerTaskMutation
} from '../../../../store/api/productionApi';

export const useProjectDetail = (id, user) => {
    const [tab, setTab] = useState('overview');
    
    // Modal & Form States
    const [showSubtaskModal, setShowSubtaskModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [subtask, setSubtask] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
    
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [replaceData, setReplaceData] = useState({ staffType: '', currentStaffId: '', currentStaffName: '', reason: '' });
    
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const { data: projectRes, isLoading: loadingProject } = useGetEngineerProjectByIdQuery(id, { skip: !id });
    const { data: tasksRes, isLoading: loadingTasks } = useGetEngineerProjectTasksQuery(id, { skip: !id });
    const { data: activityRes, isLoading: loadingActivity } = useGetEngineerProjectActivityQuery(id, { skip: !id });
    const { data: siteTeamRes, isLoading: loadingTeam } = useGetSiteTeamQuery();
    const { data: supervisorsRes, isLoading: loadingSupervisors } = useGetSupervisorsQuery();

    const [createSubtask, { isLoading: savingSubtask }] = useCreateEngineerSubtaskMutation();
    const [createTask, { isLoading: savingTask }] = useCreatePMTaskMutation();
    const [requestReplacement, { isLoading: savingReplacement }] = useRequestStaffReplacementMutation();
    const [assignTask] = useAssignEngineerTaskMutation();

    const project = projectRes?.success ? projectRes.data : null;
    const tasks = tasksRes?.success ? tasksRes.data : [];
    const activity = activityRes?.success ? activityRes.data : [];
    const siteTeam = siteTeamRes?.success ? siteTeamRes.data : [];
    const supervisors = supervisorsRes?.success ? supervisorsRes.data : [];

    const loading = loadingProject || loadingTasks || loadingActivity || loadingTeam || loadingSupervisors;
    const saving = savingSubtask || savingTask || savingReplacement;

    const handleCreateSubtask = async (e) => {
        e.preventDefault();
        if (!subtask.title || !subtask.assignedTo) return showToast('Title and assignee are required', 'error');
        try {
            await createSubtask({ ...subtask, parentTaskId: selectedTask._id, projectId: id }).unwrap();
            showToast('Subtask created!');
            setShowSubtaskModal(false);
            setSubtask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to create subtask', 'error');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.assignedTo) return showToast('Title and assignee are required', 'error');
        try {
            await createTask({ ...newTask, projectId: id }).unwrap();
            showToast('Task created successfully!');
            setShowTaskModal(false);
            setNewTask({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to create task', 'error');
        }
    };

    const handleReplaceRequest = async (e) => {
        e.preventDefault();
        if (!replaceData.reason) return showToast('Please provide a reason', 'error');
        try {
            await requestReplacement({
                projectId: id,
                staffType: replaceData.staffType,
                currentStaffId: replaceData.currentStaffId,
                reason: replaceData.reason
            }).unwrap();
            showToast('Replacement request sent to PM');
            setShowReplaceModal(false);
            setReplaceData({ staffType: '', currentStaffId: '', currentStaffName: '', reason: '' });
        } catch (e) {
            showToast(e.data?.message || e.message || 'Failed to send request', 'error');
        }
    };

    const handleAssignTask = async (taskId, targetAssigneeId) => {
        try {
            await assignTask({ taskId, assignedTo: targetAssigneeId }).unwrap();
            showToast('Task assigned successfully!');
        } catch (err) {
            showToast(err.data?.message || err.message || 'Failed to assign task', 'error');
        }
    };

    const myTasks = tasks.filter(t => t.assignedTo?._id === user?._id || t.assignedTo === user?._id);
    
    return {
        project, tasks, activity, siteTeam, supervisors,
        tab, setTab, loading, toast, showToast,
        showSubtaskModal, setShowSubtaskModal,
        showTaskModal, setShowTaskModal,
        selectedTask, setSelectedTask,
        subtask, setSubtask,
        newTask, setNewTask,
        showReplaceModal, setShowReplaceModal,
        replaceData, setReplaceData,
        saving,
        handleCreateSubtask, handleCreateTask, handleReplaceRequest, handleAssignTask,
        myTasks
    };
};
