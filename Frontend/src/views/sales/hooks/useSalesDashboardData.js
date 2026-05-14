import { useState, useEffect, useCallback } from 'react';
import { taskAPI, siteVisitAPI, quotationAPI } from '../../../models/api';

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
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [tasksRes, visitsRes, quotesRes] = await Promise.all([
                taskAPI.getAll(),
                siteVisitAPI.getAll({ limit: 4 }),
                quotationAPI.getAll({ limit: 4 })
            ]);

            if (tasksRes.success) {
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

            if (visitsRes.success) {
                setRecentVisits(visitsRes.data);
            }

            if (quotesRes?.success) {
                const sortedQuotes = quotesRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
                setRecentQuotations(sortedQuotes);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.role]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        stats,
        urgentTasks,
        pendingReviews,
        recentVisits,
        recentQuotations,
        loading,
        refresh: fetchDashboardData
    };
};
