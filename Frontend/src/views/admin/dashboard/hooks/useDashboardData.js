import { useEffect } from 'react';
import { useGetDashboardStatsQuery, useGetPurchaseOrderStatsQuery } from '../../../../store/api/adminApi';

export const useDashboardData = ({ 
    setStats, setPoStats, setRevenueData, setQuotationData, setLoading, setError 
}) => {
    
    const { data: dashboardRes, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useGetDashboardStatsQuery();
    const { data: poStatsRes, isLoading: poStatsLoading, error: poStatsError, refetch: refetchPoStats } = useGetPurchaseOrderStatsQuery();

    useEffect(() => {
        setLoading(dashboardLoading || poStatsLoading);
    }, [dashboardLoading, poStatsLoading, setLoading]);

    useEffect(() => {
        if (dashboardError) setError(dashboardError.message || 'Error loading dashboard');
        if (poStatsError) setError(poStatsError.message || 'Error loading PO stats');
    }, [dashboardError, poStatsError, setError]);

    useEffect(() => {
        if (dashboardRes?.success) setStats(dashboardRes.data);
        if (poStatsRes?.success) setPoStats(poStatsRes.data);
    }, [dashboardRes, poStatsRes, setStats, setPoStats]);

    useEffect(() => {
        // Setup mock data for charts
        setRevenueData([
            { name: 'Jan', value: 46000 },
            { name: 'Feb', value: 48000 },
            { name: 'Mar', value: 55000 },
            { name: 'Apr', value: 42000 },
            { name: 'May', value: 85000 },
            { name: 'Jun', value: 68000 },
            { name: 'Jul', value: 92000 },
        ]);
        
        setQuotationData([
            { name: 'Jan', Approved: 12, Pending: 5 },
            { name: 'Feb', Approved: 15, Pending: 8 },
            { name: 'Mar', Approved: 18, Pending: 4 },
            { name: 'Apr', Approved: 10, Pending: 12 },
            { name: 'May', Approved: 25, Pending: 6 },
            { name: 'Jun', Approved: 22, Pending: 3 },
        ]);
    }, [setRevenueData, setQuotationData]);

    const fetchDashboardData = () => {
        refetchDashboard();
        refetchPoStats();
    };

    return { fetchDashboardData };
};
