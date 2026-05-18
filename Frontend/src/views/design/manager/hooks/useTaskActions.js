import { useState } from 'react';
import { taskAPI, projectAPI } from '../../../../models/api';

export const useTaskActions = (fetchData) => {
    const [submittingTask, setSubmittingTask] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [taskFormData, setTaskFormData] = useState({
        title: '', description: '', creativeRequirements: '',
        assignedTo: [], priority: 'Medium', dueDate: '', project: ''
    });
    const [reviewStatus, setReviewStatus] = useState('Approved');
    const [managerFeedback, setManagerFeedback] = useState('');
    const [splitTaskData, setSplitTaskData] = useState({ title: '', assignedTo: [] });

    const resetTaskForm = () => {
        setEditingTaskId(null);
        setTaskFormData({ title: '', description: '', creativeRequirements: '', assignedTo: [], priority: 'Medium', dueDate: '', project: '' });
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        setSubmittingTask(true);
        try {
            const res = editingTaskId
                ? await taskAPI.update(editingTaskId, taskFormData)
                : await taskAPI.create(taskFormData);
            if (res.success) {
                resetTaskForm();
                fetchData();
                return true;
            }
        } catch (err) {
            alert('Assignment failed: ' + err.message);
        } finally {
            setSubmittingTask(false);
        }
        return false;
    };

    const handleReviewSubmission = async (selectedTask) => {
        if (!selectedTask?.submissions?.length) return false;
        const latestSub = selectedTask.submissions[selectedTask.submissions.length - 1];
        try {
            const res = await taskAPI.review(selectedTask._id, {
                submissionId: latestSub._id,
                status: reviewStatus,
                managerFeedback
            });
            if (res.success) {
                setManagerFeedback('');
                fetchData();
                return true;
            }
        } catch (err) {
            alert('Review failed: ' + err.message);
        }
        return false;
    };

    const handleSendToAdmin = async (taskId) => {
        if (!window.confirm('Sales has approved. Push this design and BOQ to Superadmin for final approval?')) return;
        try {
            const res = await taskAPI.sendToAdmin(taskId);
            if (res.success) { alert('Design pushed to Superadmin successfully!'); fetchData(); }
        } catch (err) { alert('Push failed: ' + err.message); }
    };

    const handleProjectHandoff = async (projectId) => {
        if (!window.confirm('Are you sure you want to hand off this entire project to procurement?')) return;
        try {
            const res = await projectAPI.performHandoff(projectId);
            if (res.success) { alert('Project handed off to procurement successfully!'); fetchData(); }
        } catch (err) { alert('Handoff failed: ' + err.message); }
    };

    const handleSplitTask = async (selectedTask) => {
        if (!splitTaskData.title || splitTaskData.assignedTo.length === 0) {
            return alert('Please fill in sub-task title and assignment');
        }
        try {
            const res = await taskAPI.create({
                ...selectedTask, _id: undefined,
                title: splitTaskData.title, assignedTo: splitTaskData.assignedTo,
                status: 'To Do', progress: 0, submissions: [], dailyUpdates: []
            });
            if (res.success) { alert('Task split successfully!'); fetchData(); return true; }
        } catch { alert('Failed to split task'); }
        return false;
    };

    const handleReassignTask = async (taskId, staffIds, reason) => {
        if (!window.confirm('Are you sure you want to reassign this task?')) return;
        try {
            const res = await taskAPI.reassign(taskId, staffIds, reason);
            if (res.success) { alert('Task reassigned successfully'); fetchData(); }
        } catch (err) { alert('Reassignment failed: ' + err.message); }
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
