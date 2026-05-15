import { taskAPI } from '../../../../models/api';

export const useTasksActions = ({ 
    editingTask, formData, fetchTasks, showToast, closeModal, 
    setTasks, setSubmitting 
}) => {

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            if (editingTask) {
                const response = await taskAPI.update(editingTask._id, formData);
                if (response.success) {
                    await fetchTasks();
                    showToast('Task updated successfully');
                    closeModal();
                }
            } else {
                const response = await taskAPI.create(formData);
                if (response.success) {
                    await fetchTasks();
                    showToast('New task assigned successfully');
                    closeModal();
                }
            }
        } catch (err) {
            showToast(err.message || 'Failed to save task', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const response = await taskAPI.update(taskId, { status: newStatus });
            if (response.success) {
                setTasks(prev => prev.map(t => t._id === taskId ? { 
                    ...t, 
                    status: newStatus, 
                    progress: newStatus === 'Completed' ? 100 : t.progress 
                } : t));
                showToast(`Task status updated to ${newStatus}`);
            }
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleProgressChange = async (taskId, newProgress) => {
        try {
            const updateData = { progress: newProgress };
            if (newProgress === 100) updateData.status = 'Completed';
            else if (newProgress > 0 && newProgress < 100) updateData.status = 'In Progress';

            const response = await taskAPI.update(taskId, updateData);
            if (response.success) {
                setTasks(prev => prev.map(t => t._id === taskId ? { ...t, ...updateData } : t));
            }
        } catch (err) {
            showToast('Failed to update progress', 'error');
        }
    };

    const handleSalesReview = async (taskId, approved) => {
        const notes = prompt(approved ? 'Add optional sales notes:' : 'Enter reason for revision:');
        if (!approved && !notes) return;

        try {
            const response = await taskAPI.salesApprove(taskId, { approved, salesNotes: notes || '' });
            if (response.success) {
                setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: approved ? 'Sales Approved' : 'Revision Required' } : t));
                showToast(approved ? 'Design approved by Sales' : 'Revision requested');
            }
        } catch (err) {
            showToast('Sales review failed', 'error');
        }
    };

    const handleAdminReview = async (taskId, approved) => {
        const notes = prompt(approved ? 'Add final approval notes (optional):' : 'Enter rejection reason (required):');
        if (!approved && !notes) return;

        try {
            const response = await taskAPI.adminReview(taskId, { approved, rejectionReason: notes || '' });
            if (response.success) {
                setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: approved ? 'Pushed to Procurement' : 'Admin Rejected' } : t));
                showToast(approved ? 'Pushed to Procurement successfully' : 'Design rejected and sent back');
            }
        } catch (err) {
            showToast('Admin review failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const response = await taskAPI.delete(id);
            if (response.success) {
                await fetchTasks();
                showToast('Task deleted successfully');
            }
        } catch (err) {
            showToast('Failed to delete task', 'error');
        }
    };

    return {
        handleSubmit,
        handleStatusChange,
        handleProgressChange,
        handleSalesReview,
        handleAdminReview,
        handleDelete
    };
};
