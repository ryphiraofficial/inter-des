import { useGetEngineerDashboardQuery } from '../../../../store/api/productionApi';

export const useEngineerDashboard = () => {
    const { data: res, isLoading: loading, error } = useGetEngineerDashboardQuery();
    const data = res?.success ? res.data : null;

    const stats = data?.stats || { total: 0, pending: 0, inProgress: 0, completed: 0, approved: 0 };
    const doneRate = stats.total > 0 ? Math.round(((stats.completed + stats.approved) / stats.total) * 100) : 0;

    return {
        data,
        loading,
        error,
        stats,
        doneRate
    };
};
