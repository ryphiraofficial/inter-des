import { useState, useEffect, useMemo, useCallback } from 'react';
import { useGetDashboardStatsQuery, useGetQuotationsQuery } from '../../../../store/api/adminApi';

export const useReportData = () => {
    const [stats, setStats] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [error, setError] = useState(null);

    const { data: reportRes, isLoading: reportLoading, error: reportError, refetch: refetchReport } = useGetDashboardStatsQuery();
    const { data: quoteRes, isLoading: quoteLoading, error: quoteError, refetch: refetchQuote } = useGetQuotationsQuery();

    const loading = reportLoading || quoteLoading;

    useEffect(() => {
        if (reportError) setError(reportError.message || 'Error fetching reports');
        else if (quoteError) setError(quoteError.message || 'Error fetching quotations');
        else setError(null);
    }, [reportError, quoteError]);

    useEffect(() => {
        if (reportRes?.success) setStats(reportRes.data);
        if (quoteRes?.success) setQuotations(quoteRes.data);
    }, [reportRes, quoteRes]);

    useEffect(() => {
        const handleExport = () => window.print();
        window.addEventListener('export-reports-pdf', handleExport);
        
        return () => window.removeEventListener('export-reports-pdf', handleExport);
    }, []);

    const fetchReportData = useCallback(() => {
        refetchReport();
        refetchQuote();
    }, [refetchReport, refetchQuote]);

    const conversionRate = useMemo(() => {
        if (!stats?.quotations?.total || stats.quotations.total === 0) return '0.0';
        return ((stats.quotations.approved / stats.quotations.total) * 100).toFixed(1);
    }, [stats]);

    return { stats, quotations, loading, error, conversionRate, fetchReportData };
};
