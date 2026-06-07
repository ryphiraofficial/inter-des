import { useEffect } from 'react';
import { 
    useGetDesignApprovalsQuery, 
    useGetMaterialRequestsQuery, 
    useGetProductionManagersQuery,
    useGetCompletedProductionProjectsQuery,
    useGetUsersQuery,
    useGetProjectsQuery
} from '../../../../store/api/adminApi';

export const useApprovalsData = ({ 
    setTasks, setAccountsProjects, setProcurementItems, setProductionProjects, setLoading, 
    setProductionManagers, setProcurementManagers, setAccountsManagers, showToast 
}) => {
    const { data: designTasksRes, isLoading: designLoading, error: designError, refetch: refetchDesign } = useGetDesignApprovalsQuery();
    const { data: accountsProjectsRes, isLoading: accountsLoading, refetch: refetchAccounts } = useGetProjectsQuery({ stage: 'Accounts' });
    const { data: materialRequestsRes, isLoading: materialLoading, error: materialError, refetch: refetchMaterial } = useGetMaterialRequestsQuery({ status: 'Pending Admin Review' });
    const { data: prodManagersRes, isLoading: prodManLoading } = useGetProductionManagersQuery();
    const { data: procManagersRes, isLoading: procManLoading } = useGetUsersQuery({ role: 'Procurement Manager', status: 'Active', limit: 100 });
    const { data: accManagersRes, isLoading: accManLoading } = useGetUsersQuery({ role: 'Accounts Manager', status: 'Active', limit: 100 });
    const { data: prodProjectsRes, isLoading: prodProjLoading, refetch: refetchProjects } = useGetCompletedProductionProjectsQuery();

    const isLoading = designLoading || accountsLoading || materialLoading || prodManLoading || procManLoading || accManLoading || prodProjLoading;

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (designError || materialError) {
            showToast('Failed to fetch approvals', 'error');
        }
    }, [designError, materialError, showToast]);

    useEffect(() => {
        const tasksArray = Array.isArray(designTasksRes) ? designTasksRes : (designTasksRes?.data || []);
        const designPending = tasksArray.filter(t => t.status === 'Pending Admin Review' && t.project);
        const procPendingTasks = tasksArray.filter(t => t.status === 'Pending Procurement Admin Review' && t.project).map(t => ({ ...t, type: 'Task' }));
        
        setTasks(designPending);

        const accountsArray = Array.isArray(accountsProjectsRes) ? accountsProjectsRes : (accountsProjectsRes?.data || []);
        setAccountsProjects(accountsProjectsRes?.data || accountsArray);
        
        const mrsArray = Array.isArray(materialRequestsRes) ? materialRequestsRes : (materialRequestsRes?.data || []);
        const procPendingMRs = mrsArray.filter(m => m.project).map(m => ({ ...m, type: 'MaterialRequest' }));
        
        setProcurementItems([...procPendingTasks, ...procPendingMRs]);
    }, [designTasksRes, accountsProjectsRes, materialRequestsRes, setTasks, setAccountsProjects, setProcurementItems]);

    useEffect(() => {
        if (prodManagersRes?.data) setProductionManagers(prodManagersRes.data);
        if (procManagersRes?.data && setProcurementManagers) setProcurementManagers(procManagersRes.data);
        if (accManagersRes?.data && setAccountsManagers) setAccountsManagers(accManagersRes.data);
        if (prodProjectsRes?.data) setProductionProjects(prodProjectsRes.data);
    }, [prodManagersRes, procManagersRes, accManagersRes, prodProjectsRes, setProductionManagers, setProcurementManagers, setAccountsManagers, setProductionProjects]);

    const fetchPendingApprovals = () => {
        refetchDesign();
        refetchMaterial();
    };

    const fetchProductionManagers = () => {};
    const fetchProcurementManagers = () => {};
    const fetchCompletedProductionProjects = () => refetchProjects();

    return { fetchPendingApprovals, fetchProductionManagers, fetchProcurementManagers, fetchCompletedProductionProjects };
};
