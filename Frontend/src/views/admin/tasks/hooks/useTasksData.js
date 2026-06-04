import { useEffect, useCallback } from 'react';
import { 
    useGetTasksQuery, 
    useGetStaffQuery, 
    useGetClientsQuery, 
    useGetQuotationsQuery 
} from '../../../../store/api/adminApi';

export const useTasksData = ({ 
    setTasks, setStaff, setClients, setQuotations, 
    setLoading, setError, showToast, setShowTaskModal, setFormData, setSearchTerm
}) => {
    const { data: tasksRes, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetTasksQuery();
    const { data: staffRes, isLoading: staffLoading } = useGetStaffQuery();
    const { data: clientsRes, isLoading: clientsLoading } = useGetClientsQuery({ limit: 1000 });
    const { data: quotationsRes, isLoading: quotationsLoading } = useGetQuotationsQuery({ limit: 1000 });

    const isLoading = tasksLoading || staffLoading || clientsLoading || quotationsLoading;

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (tasksError) {
            setError(tasksError.message || 'Error loading tasks');
            showToast('Failed to load task data', 'error');
        }
    }, [tasksError, setError, showToast]);

    useEffect(() => {
        if (tasksRes?.success) setTasks(tasksRes.data);
        if (staffRes?.success) setStaff(staffRes.data);
        if (clientsRes?.success) setClients(clientsRes.data);
        if (quotationsRes?.success) setQuotations(quotationsRes.data);
    }, [tasksRes, staffRes, clientsRes, quotationsRes, setTasks, setStaff, setClients, setQuotations]);

    const fetchAllData = useCallback(() => {
        refetchTasks();
    }, [refetchTasks]);

    useEffect(() => {
        const processAIData = (data) => {
            if (!data) return;
            setFormData(prev => ({ ...prev, ...data }));
            setShowTaskModal(true);
        };

        const handleAIPopulate = (e) => processAIData(e.detail);
        const pending = sessionStorage.getItem('AI_PENDING_DATA');
        if (pending) {
            const { type, data } = JSON.parse(pending);
            if (type === 'TASK') {
                processAIData(data);
                sessionStorage.removeItem('AI_PENDING_DATA');
            }
        }

        const handleOpenTaskModal = () => setShowTaskModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('AI_POPULATE_TASK', handleAIPopulate);
        window.addEventListener('open-create-task-modal', handleOpenTaskModal);
        window.addEventListener('header-search', handleHeaderSearch);
        
        return () => {
            window.removeEventListener('AI_POPULATE_TASK', handleAIPopulate);
            window.removeEventListener('open-create-task-modal', handleOpenTaskModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setFormData, setShowTaskModal, setSearchTerm]);

    return { fetchTasks: refetchTasks, fetchAllData };
};
