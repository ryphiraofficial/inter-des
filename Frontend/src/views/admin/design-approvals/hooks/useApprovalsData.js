import { useEffect } from 'react';
import { taskAPI, procurementAPI } from '../../../../models/api';

export const useApprovalsData = ({ 
    setTasks, setProcurementItems, setLoading, setProductionManagers, showToast 
}) => {

    const fetchProductionManagers = async () => {
        try {
            const res = await procurementAPI.getProductionManagers();
            setProductionManagers(res?.data || []);
        } catch (err) {
            console.error('Failed to fetch production managers:', err);
        }
    };

    const fetchPendingApprovals = async () => {
        try {
            setLoading(true);
            const [taskRes, mrRes] = await Promise.all([
                taskAPI.getAll({ status: 'Pending Admin Review,Pending Procurement Admin Review' }),
                procurementAPI.getMaterialRequests({ status: 'Pending Admin Review' })
            ]);
            
            const tasksArray = Array.isArray(taskRes) ? taskRes : (taskRes?.data || []);
            const designPending = tasksArray.filter(t => t.status === 'Pending Admin Review');
            const procPendingTasks = tasksArray.filter(t => t.status === 'Pending Procurement Admin Review').map(t => ({ ...t, type: 'Task' }));
            
            setTasks(designPending);
            
            const mrsArray = Array.isArray(mrRes) ? mrRes : (mrRes?.data || []);
            const procPendingMRs = mrsArray.map(m => ({ ...m, type: 'MaterialRequest' }));
            
            setProcurementItems([...procPendingTasks, ...procPendingMRs]);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch approvals', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingApprovals();
        fetchProductionManagers();
    }, []);

    return { fetchPendingApprovals, fetchProductionManagers };
};
