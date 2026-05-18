import { useEffect } from 'react';
import { quotationAPI, userAPI } from '../../../../../models/api';

export const useQuotationListData = ({ 
    setQuotations, setLoading, setError, setSearchTerm, setDesignManagers 
}) => {
    
    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await quotationAPI.getAll();
            if (response.success) {
                setQuotations(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDesignManagers = async () => {
        try {
            const response = await userAPI.getAll({ role: 'Design Manager', status: 'Active', limit: 100 });
            if (response.success && setDesignManagers) {
                setDesignManagers(response.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch design managers:', err);
        }
    };

    useEffect(() => {
        fetchQuotations();
        fetchDesignManagers();

        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setQuotations, setLoading, setError, setSearchTerm, setDesignManagers]);

    return { fetchQuotations };
};
