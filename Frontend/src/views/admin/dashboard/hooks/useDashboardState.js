import { useState } from 'react';

export const useDashboardState = () => {
    const [stats, setStats] = useState(null);
    const [poStats, setPoStats] = useState({ total: 0, pending: 0, ordered: 0, received: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [quotationData, setQuotationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return {
        stats, setStats,
        poStats, setPoStats,
        revenueData, setRevenueData,
        quotationData, setQuotationData,
        loading, setLoading,
        error, setError
    };
};
