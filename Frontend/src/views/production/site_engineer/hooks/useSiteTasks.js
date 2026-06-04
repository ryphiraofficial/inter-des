import { useState } from 'react';
import { useGetEngineerTasksQuery, useGetEngineerTaskByIdQuery } from '../../../../store/api/productionApi';

export const useSiteTasks = (isTransferred) => {
    const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    const { data: res, isLoading: loading, refetch: reloadTasks } = useGetEngineerTasksQuery(isTransferred ? { transferred: 'true' } : {});
    const tasks = res?.success ? res.data : [];

    const { data: taskRes } = useGetEngineerTaskByIdQuery(selectedTaskId, { skip: !selectedTaskId });
    
    let selected = null;
    if (selectedTaskId) {
        selected = taskRes?.success ? taskRes.data : tasks.find(t => t._id === selectedTaskId);
    }

    const openTask = (task) => {
        setSelectedTaskId(task._id);
    };

    const closeTask = () => setSelectedTaskId(null);

    const setFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const activeFilterCount = (filters.status !== 'All' ? 1 : 0) + (filters.priority !== 'All' ? 1 : 0);

    const filteredTasks = tasks.filter(t => {
        if (activeTab === 'Pending' && t.status === 'Completed') return false;
        if (activeTab === 'Completed' && t.status !== 'Completed') return false;
        if (filters.status !== 'All' && t.status !== filters.status) return false;
        if (filters.priority !== 'All' && t.priority !== filters.priority) return false;
        return true;
    });

    return {
        tasks,
        filteredTasks,
        loading,
        filters,
        setFilter,
        showFilters,
        setShowFilters,
        activeTab,
        setActiveTab,
        activeFilterCount,
        selected,
        openTask,
        closeTask,
        reloadTasks
    };
};
