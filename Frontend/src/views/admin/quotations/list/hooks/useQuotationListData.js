import { useEffect } from 'react';
import { useGetQuotationsQuery, useGetUsersQuery } from '../../../../../store/api/adminApi';

export const useQuotationListData = ({ 
    setQuotations, setLoading, setError, setSearchTerm, setDesignManagers 
}) => {
    
    const { data: quotationsRes, isLoading: quotLoading, error: quotError, refetch } = useGetQuotationsQuery();
    const { data: managersRes } = useGetUsersQuery({ role: 'Design Manager', status: 'Active', limit: 100 });

    useEffect(() => {
        setLoading(quotLoading);
    }, [quotLoading, setLoading]);

    useEffect(() => {
        if (quotError) setError(quotError.message || 'Error fetching quotations');
    }, [quotError, setError]);

    useEffect(() => {
        if (quotationsRes?.success) setQuotations(quotationsRes.data);
    }, [quotationsRes, setQuotations]);

    useEffect(() => {
        if (managersRes?.success && setDesignManagers) {
            setDesignManagers(managersRes.data);
        }
    }, [managersRes, setDesignManagers]);

    useEffect(() => {
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setSearchTerm]);

    return { fetchQuotations: refetch };
};
