import { useEffect } from 'react';
import { taskAPI, staffAPI, clientAPI, quotationAPI } from '../../../../models/api';

export const useTasksData = ({ 
    setTasks, setStaff, setClients, setQuotations, 
    setLoading, setError, showToast, setShowTaskModal, setFormData, setSearchTerm
}) => {
    
    const fetchTasks = async () => {
        try {
            const response = await taskAPI.getAll();
            if (response.success) setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [tasksRes, staffRes, clientsRes, quotationsRes] = await Promise.all([
                taskAPI.getAll(),
                staffAPI.getAll(),
                clientAPI.getAll({ limit: 1000 }),
                quotationAPI.getAll({ limit: 1000 })
            ]);

            if (tasksRes.success) setTasks(tasksRes.data);
            if (staffRes.success) setStaff(staffRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
            if (quotationsRes.success) setQuotations(quotationsRes.data);
        } catch (err) {
            setError(err.message);
            showToast('Failed to load task data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();

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
    }, []);

    return { fetchTasks, fetchAllData };
};
