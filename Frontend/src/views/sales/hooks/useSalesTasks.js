import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { taskAPI } from '../../../models/api';

export const useSalesTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';
    const [filterStatus, setFilterStatus] = useState('All');
    const [updatingTaskId, setUpdatingTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getAll();
            if (response.success) {
                setTasks(response.data);
            }
        } catch (err) {
            console.error('Failed to load tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSalesReview = async (taskId, approved) => {
        try {
            const notes = prompt(approved ? 'Add approval notes (optional):' : 'Reason for rejection:');
            if (!approved && !notes) {
                alert('Rejection reason is required');
                return;
            }
            
            setUpdatingTaskId(taskId);
            const response = await taskAPI.salesApprove(taskId, { approved, salesNotes: notes });
            if (response.success) {
                alert(approved ? 'Design approved successfully!' : 'Design sent back for revision');
                fetchTasks();
            }
        } catch (err) {
            console.error('Failed to review:', err);
            alert('Action failed: ' + err.message);
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
        'Review Required': tasks.filter(t => t.status === 'Pending Sales Review').length,
        Completed: tasks.filter(t => t.status === 'Completed').length
    };

    return {
        loading,
        filterStatus,
        setFilterStatus,
        updatingTaskId,
        filteredTasks,
        stats,
        handleSalesReview
    };
};
