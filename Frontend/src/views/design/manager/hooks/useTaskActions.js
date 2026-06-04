import { useState } from 'react';
import {
    useUpdateDesignTaskMutation,
    useCreateDesignTaskMutation,
    useReviewTaskMutation,
    useSendTaskToAdminMutation,
    usePerformProjectHandoffMutation,
    useReassignTaskMutation
} from '../../../../store/api/designApi';

export const useTaskActions = () => {
    const [submittingTask, setSubmittingTask] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskFormData, setTaskFormData] = useState({
        title: '', description: '', creativeRequirements: '',
        assignedTo: [], priority: 'Medium', dueDate: '', project: ''
    });
    const [reviewStatus, setReviewStatus] = useState('Approved');
    const [managerFeedback, setManagerFeedback] = useState('');
    const [splitTaskData, setSplitTaskData] = useState({ title: '', assignedTo: [] });

    const [updateTask] = useUpdateDesignTaskMutation();
    const [createTask] = useCreateDesignTaskMutation();
    const [reviewTask] = useReviewTaskMutation();
    const [sendToAdmin] = useSendTaskToAdminMutation();
    const [performHandoff] = usePerformProjectHandoffMutation();
    const [reassignTask] = useReassignTaskMutation();

    const resetTaskForm = () => {
        setEditingTaskId(null);
        setTaskFormData({ title: '', description: '', creativeRequirements: '', assignedTo: [], priority: 'Medium', dueDate: '', project: '' });
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        setSubmittingTask(true);
        try {
            if (editingTaskId) {
                await updateTask({ id: editingTaskId, ...taskFormData }).unwrap();
            } else {
                await createTask(taskFormData).unwrap();
            }
            resetTaskForm();
            return true;
        } catch (err) {
            alert('Assignment failed: ' + (err.data?.message || err.message));
        } finally {
            setSubmittingTask(false);
        }
        return false;
    };

    const handleReviewSubmission = async (selectedTask) => {
        if (!selectedTask?.submissions?.length) return false;
        const latestSub = selectedTask.submissions[selectedTask.submissions.length - 1];
        try {
            await reviewTask({
                id: selectedTask._id,
                submissionId: latestSub._id,
                status: reviewStatus,
                managerFeedback
            }).unwrap();
            setManagerFeedback('');
            return true;
        } catch (err) {
            alert('Review failed: ' + (err.data?.message || err.message));
        }
        return false;
    };

    const handleSendToAdmin = async (taskId) => {
        if (!window.confirm('Sales has approved. Push this design and BOQ to Superadmin for final approval?')) return;
        try {
            await sendToAdmin(taskId).unwrap();
            alert('Design pushed to Superadmin successfully!');
        } catch (err) { 
            alert('Push failed: ' + (err.data?.message || err.message)); 
        }
    };

    const handleProjectHandoff = async (projectId) => {
        if (!window.confirm('Are you sure you want to hand off this entire project to procurement?')) return;
        try {
            await performHandoff(projectId).unwrap();
            alert('Project handed off to procurement successfully!');
        } catch (err) { 
            alert('Handoff failed: ' + (err.data?.message || err.message)); 
        }
    };

    const handleSplitTask = async (selectedTask) => {
        if (!splitTaskData.title || splitTaskData.assignedTo.length === 0) {
            return alert('Please fill in sub-task title and assignment');
        }
        try {
            await createTask({
                ...selectedTask, _id: undefined,
                title: splitTaskData.title, assignedTo: splitTaskData.assignedTo,
                status: 'To Do', progress: 0, submissions: [], dailyUpdates: []
            }).unwrap();
            alert('Task split successfully!'); 
            setSplitTaskData({ title: '', assignedTo: [] });
            return true; 
        } catch { 
            alert('Failed to split task'); 
        }
        return false;
    };

    const handleReassignTask = async (taskId, staffIds, reason) => {
        if (!window.confirm('Are you sure you want to reassign this task?')) return;
        try {
            await reassignTask({ id: taskId, assignedTo: staffIds, reason }).unwrap();
            alert('Task reassigned successfully');
        } catch (err) { 
            alert('Reassignment failed: ' + (err.data?.message || err.message)); 
        }
    };

    return {
        submittingTask, editingTaskId, setEditingTaskId,
        taskFormData, setTaskFormData, resetTaskForm,
        reviewStatus, setReviewStatus,
        managerFeedback, setManagerFeedback,
        splitTaskData, setSplitTaskData,
        handleAssignTask, handleReviewSubmission,
        handleSendToAdmin, handleProjectHandoff,
        handleSplitTask, handleReassignTask,
    };
};
