import { useState, useEffect, useMemo, useCallback } from 'react';
import { useGetDashboardStatsQuery, useGetQuotationsQuery } from '../../../../store/api/adminApi';
import { useDateFilter } from '../../../../context/DateFilterContext';

export const useReportData = () => {
    const { isDateInRange } = useDateFilter();
    const [stats, setStats] = useState(null);
    const [rawQuotations, setRawQuotations] = useState([]);
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
        if (quoteRes?.success) setRawQuotations(quoteRes.data);
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

    const quotations = useMemo(() => {
        return rawQuotations.filter(q => isDateInRange(q.createdAt || q.date || q.updatedAt));
    }, [rawQuotations, isDateInRange]);

    const dynamicStats = useMemo(() => {
        if (!stats) return null;
        if (!quotations.length && rawQuotations.length) {
            return {
                ...stats,
                quotations: { total: 0, approved: 0, pending: 0, rejected: 0 }
            };
        }
        const approved = quotations.filter(q => q.status === 'Approved' || q.status === 'approved').length;
        const total = quotations.length;
        return {
            ...stats,
            quotations: {
                total: total || stats.quotations?.total || 0,
                approved: approved || stats.quotations?.approved || 0,
                pending: (total - approved) || stats.quotations?.pending || 0,
                rejected: 0
            }
        };
    }, [stats, quotations, rawQuotations]);

    const conversionRate = useMemo(() => {
        const total = dynamicStats?.quotations?.total || 0;
        if (total === 0) return '0.0';
        return (((dynamicStats?.quotations?.approved || 0) / total) * 100).toFixed(1);
    }, [dynamicStats]);

    return { stats: dynamicStats || stats, quotations, loading, error, conversionRate, fetchReportData };
};
