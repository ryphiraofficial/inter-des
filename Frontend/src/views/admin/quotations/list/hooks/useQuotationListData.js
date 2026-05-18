import { useEffect } from 'react';
import { quotationAPI, userAPI } from '../../../../../models/api';

export const useQuotationListData = ({ 
    setQuotations, setLoading, setError, setSearchTerm, setProcurementManagers 
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

    const fetchProcurementManagers = async () => {
        try {
            const response = await userAPI.getAll({ role: 'Procurement Manager', status: 'Active', limit: 100 });
            if (response.success && setProcurementManagers) {
                setProcurementManagers(response.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch procurement managers:', err);
        }
    };

    useEffect(() => {
        fetchQuotations();
        fetchProcurementManagers();

        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setQuotations, setLoading, setError, setSearchTerm, setProcurementManagers]);

    return { fetchQuotations };
};
