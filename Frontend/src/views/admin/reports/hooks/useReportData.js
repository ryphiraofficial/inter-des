import { useState, useEffect, useMemo } from 'react';
import { reportAPI, quotationAPI } from '../../../../models/api';

export const useReportData = () => {
    const [stats, setStats] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const [reportRes, quoteRes] = await Promise.all([
                reportAPI.getDashboard(),
                quotationAPI.getAll()
            ]);

            if (reportRes.success) setStats(reportRes.data);
            if (quoteRes.success) setQuotations(quoteRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
        
        const handleExport = () => window.print();
        window.addEventListener('export-reports-pdf', handleExport);
        
        return () => window.removeEventListener('export-reports-pdf', handleExport);
    }, []);

    const conversionRate = useMemo(() => {
        if (!stats?.quotations?.total || stats.quotations.total === 0) return '0.0';
        return ((stats.quotations.approved / stats.quotations.total) * 100).toFixed(1);
    }, [stats]);

    return { stats, quotations, loading, error, conversionRate, fetchReportData };
};
