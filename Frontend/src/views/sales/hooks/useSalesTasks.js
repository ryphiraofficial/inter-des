import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSalesTasksQuery, useApproveSalesTaskMutation } from '../../../store/api/salesApi';

export const useSalesTasks = (mode = 'active') => {
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const [filterStatus, setFilterStatus] = useState('All');
    
    const { data: tasksRes, isLoading: loading } = useGetSalesTasksQuery();
    const [approveTask, { isLoading: isUpdating }] = useApproveSalesTaskMutation();
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    let tasks = tasksRes?.success ? tasksRes.data : [];

    if (mode === 'active') {
        tasks = tasks.filter(t => t.status !== 'Completed');
    } else if (mode === 'completed') {
        tasks = tasks.filter(t => t.status === 'Completed');
    }

    const handleSalesReview = async (taskId, approved) => {
        try {
            const notes = prompt(approved ? 'Add approval notes (optional):' : 'Reason for rejection:');
            if (!approved && !notes) {
                alert('Rejection reason is required');
                return;
            }
            
            setUpdatingTaskId(taskId);
            await approveTask({ id: taskId, approved, salesNotes: notes }).unwrap();
            alert(approved ? 'Design approved successfully!' : 'Design sent back for revision');
        } catch (err) {
            console.error('Failed to review:', err);
            alert('Action failed: ' + (err.data?.message || err.message));
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        Total: tasks.length,
        'To Do': tasks.filter(t => t.status === 'To Do').length,
        'In Progress': tasks.filter(t => t.status === 'In Progress').length,
        'Review Required': tasks.filter(t => t.status === 'Pending Sales Review').length
    };

    if (mode === 'completed' || mode === 'all') {
        stats.Completed = tasks.filter(t => t.status === 'Completed').length;
    }

    return {
        loading,
        filterStatus,
        setFilterStatus,
        updatingTaskId: updatingTaskId || (isUpdating ? updatingTaskId : null),
        filteredTasks,
        stats,
        handleSalesReview
    };
};
