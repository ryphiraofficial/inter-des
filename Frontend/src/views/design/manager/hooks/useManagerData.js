import { useCallback } from 'react';
import { BASE_IMAGE_URL } from '../../../../config/constants';
import {
    useGetProjectStatsQuery,
    useGetProjectsQuery,
    useGetDesignTasksQuery,
    useGetQuotationsQuery,
    useGetStaffAnalyticsOverviewQuery,
    useGetNotificationsQuery,
    useGetStaffQuery
} from '../../../../store/api/designApi';
import { useGetMaterialRequestsQuery } from '../../../../store/api/procurementApi';

export const useManagerData = () => {
    const { data: statsRes, isLoading: statsLoading, refetch: refetchStats } = useGetProjectStatsQuery();
    const { data: projectsRes, isLoading: projectsLoading, refetch: refetchProjects } = useGetProjectsQuery({ limit: 100 });
    const { data: tasksRes, isLoading: tasksLoading, refetch: refetchTasks } = useGetDesignTasksQuery({ limit: 100 });
    const { data: quotationsRes, isLoading: quotationsLoading, refetch: refetchQuotations } = useGetQuotationsQuery({ status: 'Approved' });
    const { data: teamRes, isLoading: teamLoading, refetch: refetchTeam } = useGetStaffAnalyticsOverviewQuery();
    const { data: notificationsRes, isLoading: notificationsLoading, refetch: refetchNotifications } = useGetNotificationsQuery({ limit: 30 });
    const { data: staffRes, isLoading: staffLoading, refetch: refetchStaff } = useGetStaffQuery();
    const { data: materialRes, isLoading: materialLoading, refetch: refetchMaterial } = useGetMaterialRequestsQuery({ limit: 100 });

    const loading = statsLoading || projectsLoading || tasksLoading || quotationsLoading || 
                    teamLoading || notificationsLoading || staffLoading || materialLoading;

    const stats = statsRes?.success ? statsRes.data : null;
    const projects = projectsRes?.success ? projectsRes.data : [];
    const tasks = tasksRes?.success ? tasksRes.data : [];
    const quotations = quotationsRes?.success ? quotationsRes.data : [];
    const teamStats = teamRes?.success ? teamRes.data.filter(s => s.role?.toLowerCase().includes('design')) : [];
    const notifications = notificationsRes?.success ? notificationsRes.data : [];
    const staffList = staffRes?.success ? staffRes.data.filter(s => s.role?.toLowerCase().includes('design') && s.status === 'Active') : [];
    const materialRequests = materialRes?.success ? materialRes.data : [];

    const getImageUrl = useCallback((url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }, []);

    // A consolidated refetch function for backward compatibility with existing components
    // that might expect `fetchData()` to refresh the dashboard.
    // In a fully RTK Query-native app, we'd remove this, but this keeps the UI components untouched.
    const fetchData = useCallback(() => {
        refetchStats();
        refetchProjects();
        refetchTasks();
        refetchQuotations();
        refetchTeam();
        refetchNotifications();
        refetchStaff();
        refetchMaterial();
    }, [refetchStats, refetchProjects, refetchTasks, refetchQuotations, refetchTeam, refetchNotifications, refetchStaff, refetchMaterial]);

    return {
        stats, projects, tasks, quotations, teamStats,
        notifications, staffList, materialRequests, loading,
        fetchData, getImageUrl
    };
};
