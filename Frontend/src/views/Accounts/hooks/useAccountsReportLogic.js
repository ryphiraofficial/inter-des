import { useState, useEffect } from 'react';
import { reportAPI } from '../../../models/api';

export const useAccountsReportLogic = () => {
    const [stats, setStats] = useState(null);
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await reportAPI.getDashboard();
                if (response.success) {
                    setStats(response.stats);
                    setQuotations(response.quotations);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return { stats, quotations, loading, error };
};
