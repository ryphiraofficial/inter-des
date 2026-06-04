import {
    useGetProjectsByStageQuery,
    useGetProductionStatsQuery,
    useGetProductionTasksQuery,
} from '../../../../store/api/productionApi';

export const useProductionManagerDashboard = () => {

    const { data: projData, isLoading: projLoading } = useGetProjectsByStageQuery('Production');
    const { data: statsData, isLoading: statsLoading } = useGetProductionStatsQuery();
    const { data: tasksData, isLoading: tasksLoading } = useGetProductionTasksQuery({ limit: 10 });

    const loading = projLoading || statsLoading || tasksLoading;
    const projects = projData?.success ? projData.data : [];
    const stats = statsData?.success ? statsData.data : null;
    const tasks = tasksData?.success ? tasksData.data : [];

    const getTaskTypeColor = (type) => {
        const colors = {
            'civil': '#8b5cf6',
            'electrical': '#f59e0b',
            'plumbing': '#3b82f6',
            'painting': '#10b981'
        };
        return colors[type?.toLowerCase()] || '#64748b';
    };

    return { stats, projects, tasks, loading, getTaskTypeColor };
};
