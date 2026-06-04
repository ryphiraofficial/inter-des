import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSalesTasksQuery, useApproveSalesTaskMutation } from '../../../store/api/salesApi';

export const useSalesApprovals = () => {
    const [searchParams] = useSearchParams();
    const [priorityFilter, setPriorityFilter] = useState('');
    
    // Interactive feedback modal state
    const [actionTask, setActionTask] = useState(null); 
    const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
    const [salesNotes, setSalesNotes] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    // Preview modal state
    const [previewTask, setPreviewTask] = useState(null);

    const searchTerm = searchParams.get('q') || '';

    const { data: tasksRes, isLoading: loading, refetch: loadTasks } = useGetSalesTasksQuery();
    const [approveSalesTask] = useApproveSalesTaskMutation();

    const tasks = tasksRes?.success ? tasksRes.data : [];

    const pendingTasks = tasks.filter(t => t.status === 'Pending Sales Review');
    const approvedCount = tasks.filter(t => t.status === 'Sales Approved').length;
    const revisionCount = tasks.filter(t => t.status === 'Revision Required').length;
    const criticalCount = pendingTasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;

    // Handle Search & Filter logic
    const filteredTasks = pendingTasks.filter(task => {
        const titleMatch = task.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const projectMatch = (task.project?.projectName || task.quotation?.projectName || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        
        const matchesSearch = titleMatch || projectMatch;
        const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
        
        return matchesSearch && matchesPriority;
    });

    const triggerAction = (task, type) => {
        setActionTask(task);
        setActionType(type);
        setSalesNotes('');
    };

    const handleActionSubmit = async (e) => {
        e.preventDefault();
        if (!actionTask || !actionType) return;
        
        if (actionType === 'reject' && !salesNotes.trim()) {
            alert('Please provide feedback notes explaining the reason for the revision request.');
            return;
        }

        try {
            setSubmittingAction(true);
            const approved = actionType === 'approve';
            const res = await approveSalesTask({ 
                id: actionTask._id, 
                approved, 
                salesNotes: salesNotes.trim() 
            }).unwrap();

            if (res.success) {
                setActionTask(null);
                setActionType(null);
                setSalesNotes('');
                loadTasks();
            } else {
                alert(res.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error reviewing design:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmittingAction(false);
        }
    };

    return {
        loading,
        filteredTasks,
        pendingCount: pendingTasks.length,
        criticalCount,
        approvedCount,
        revisionCount,
        priorityFilter,
        setPriorityFilter,
        actionTask,
        setActionTask,
        actionType,
        setActionType,
        salesNotes,
        setSalesNotes,
        submittingAction,
        previewTask,
        setPreviewTask,
        triggerAction,
        handleActionSubmit
    };
};
