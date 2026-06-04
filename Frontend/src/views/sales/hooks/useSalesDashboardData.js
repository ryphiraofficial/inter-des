import { useState, useEffect, useCallback } from 'react';
import { useGetSalesTasksQuery, useGetSiteVisitsQuery, useGetSalesQuotationsQuery } from '../../../store/api/salesApi';

export const useSalesDashboardData = (user) => {
    const [stats, setStats] = useState({
        pendingTasks: 0,
        completedToday: 0,
        activeProjects: 0
    });
    const [urgentTasks, setUrgentTasks] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [recentVisits, setRecentVisits] = useState([]);
    const [recentQuotations, setRecentQuotations] = useState([]);

    const { data: tasksRes, isLoading: tasksLoading, refetch: refetchTasks } = useGetSalesTasksQuery();
    const { data: visitsRes, isLoading: visitsLoading, refetch: refetchVisits } = useGetSiteVisitsQuery({ limit: 4 });
    const { data: quotesRes, isLoading: quotesLoading, refetch: refetchQuotes } = useGetSalesQuotationsQuery({ limit: 4 });

    const loading = tasksLoading || visitsLoading || quotesLoading;

    useEffect(() => {
        if (tasksRes?.success) {
            const tasks = tasksRes.data;
            const pending = tasks.filter(t => t.status !== 'Completed').length;

            const today = new Date().toDateString();
            const doneToday = tasks.filter(t =>
                t.status === 'Completed' &&
                new Date(t.updatedAt).toDateString() === today
            ).length;

            const activeProjs = [...new Set(tasks.filter(t => t.status !== 'Completed').map(t => t.quotation?._id))].filter(id => id).length;

            setStats({
                pendingTasks: pending,
                completedToday: doneToday,
                activeProjects: activeProjs || 0
            });

            const urgent = tasks.filter(t =>
                t.status !== 'Completed' &&
                (t.priority === 'High' || t.priority === 'Critical')
            ).slice(0, 3);
            setUrgentTasks(urgent);

            if (user?.role === 'Sales') {
                const reviews = tasks.filter(t => t.status === 'Pending Sales Review');
                setPendingReviews(reviews);
            }
        }
    }, [tasksRes, user?.role]);

    useEffect(() => {
        if (visitsRes?.success) setRecentVisits(visitsRes.data);
    }, [visitsRes]);

    useEffect(() => {
        if (quotesRes?.success) {
            const sortedQuotes = [...quotesRes.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
            setRecentQuotations(sortedQuotes);
        }
    }, [quotesRes]);

    const refresh = useCallback(() => {
        refetchTasks();
        refetchVisits();
        refetchQuotes();
    }, [refetchTasks, refetchVisits, refetchQuotes]);

    return {
        stats,
        urgentTasks,
        pendingReviews,
        recentVisits,
        recentQuotations,
        loading,
        refresh
    };
};
