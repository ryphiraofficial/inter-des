import { useEffect } from 'react';
import { reportAPI, purchaseOrderAPI } from '../../../../models/api';

export const useDashboardData = ({ 
    setStats, setPoStats, setRevenueData, setQuotationData, setLoading, setError 
}) => {
    
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardRes, poStatsRes] = await Promise.all([
                reportAPI.getDashboard(),
                purchaseOrderAPI.getStats()
            ]);

            if (dashboardRes.success) setStats(dashboardRes.data);
            if (poStatsRes.success) setPoStats(poStatsRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        
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
    }, []);

    return { fetchDashboardData };
};
