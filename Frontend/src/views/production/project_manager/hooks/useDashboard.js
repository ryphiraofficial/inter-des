import { useState } from 'react';
import {
    useGetPMDashboardOverviewQuery,
    useGetPMDashboardDeadlinesQuery,
    useGetPMDashboardBudgetQuery,
    useGetPMDashboardChartsQuery,
    useGetPMKPIMetricsQuery,
    useGetPMBudgetAnalyticsQuery,
    useGetPMGanttDataQuery,
} from '../../../../store/api/productionApi';

export const useDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    // RTK Query — auto-caches, deduplicates, and refetches in the background.
    // No manual useState/useEffect for data fetching needed.
    const { data: overviewData, isLoading: overviewLoading } = useGetPMDashboardOverviewQuery();
    const { data: deadlinesData } = useGetPMDashboardDeadlinesQuery();
    const { data: budgetData } = useGetPMDashboardBudgetQuery();
    const { data: chartsData } = useGetPMDashboardChartsQuery();
    const { data: kpiData } = useGetPMKPIMetricsQuery();
    const { data: budgetAnalyticsData } = useGetPMBudgetAnalyticsQuery();
    const { data: ganttData } = useGetPMGanttDataQuery();

    const data = overviewData?.success ? overviewData.data : {
        totalProjects: 0, activeProjects: 0,
        pendingApprovals: 0, completedTasks: 0,
        projects: [], recentActivity: []
    };

    const teamWorkload = overviewData?.success ? (overviewData.data?.teamWorkload ?? []) : [];
    const deadlines = deadlinesData?.success ? deadlinesData.data : [];
    const budget = budgetData?.success ? budgetData.data : null;
    const budgetPercent = budget ? Math.round((budget.spent / budget.total) * 100) : 0;

    return {
        loading: overviewLoading,
        activeTab, setActiveTab,
        data,
        teamWorkload,
        deadlines,
        budgetData: budget,
        budgetPercent,
        chartData: chartsData?.success ? chartsData.data : null,
        kpiData: kpiData?.success ? kpiData.data : null,
        budgetAnalytics: budgetAnalyticsData?.success ? budgetAnalyticsData.data : null,
        ganttData: ganttData?.success ? ganttData.data : [],
    };
};
