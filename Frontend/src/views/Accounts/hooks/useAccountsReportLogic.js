import { useState, useEffect } from 'react';
import { useGetAccountsReportsQuery, useGetAccountsQuotationsQuery } from '../../../store/api/accountsApi';

export const useAccountsReportLogic = () => {
    const [stats, setStats] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [error, setError] = useState(null);

    const { data: reportRes, isLoading: reportLoading, error: reportErr } = useGetAccountsReportsQuery();
    const { data: quoteRes, isLoading: quoteLoading, error: quoteErr } = useGetAccountsQuotationsQuery();

    const loading = reportLoading || quoteLoading;

    useEffect(() => {
        if (reportErr || quoteErr) {
            setError(reportErr?.data?.message || quoteErr?.data?.message || 'An error occurred while fetching reports.');
        } else if (reportRes && quoteRes) {
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
        }
    }, [reportRes, quoteRes, reportErr, quoteErr]);

    return { stats, quotations, loading, error };
};
