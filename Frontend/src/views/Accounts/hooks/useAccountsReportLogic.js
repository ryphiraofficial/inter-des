import { useState, useEffect } from 'react';
import { reportAPI, quotationAPI } from '../../../models/api';

export const useAccountsReportLogic = () => {
    const [stats, setStats] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const [reportRes, quoteRes] = await Promise.all([
                    reportAPI.getDashboard(),
                    quotationAPI.getAll()
                ]);

                if (reportRes.success && quoteRes.success) {
                    const dashboardData = reportRes.data;
                    const quotesList = quoteRes.data;

                    setStats({
                        totalRevenue: dashboardData?.revenue?.approved || 0,
                        pendingPayments: dashboardData?.revenue?.potential || 0,
                        totalProjects: dashboardData?.quotations?.approved || 0,
                        approvedQuotes: dashboardData?.quotations?.approved || 0
                    });

                    setQuotations(quotesList || []);
                } else {
                    setError('Failed to load report data from server.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching reports.');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return { stats, quotations, loading, error };
};
