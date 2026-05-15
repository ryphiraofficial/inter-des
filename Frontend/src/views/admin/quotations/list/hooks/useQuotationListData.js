import { useEffect } from 'react';
import { quotationAPI } from '../../../../../models/api';

export const useQuotationListData = ({ setQuotations, setLoading, setError, setSearchTerm }) => {
    
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

    useEffect(() => {
        fetchQuotations();

        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setQuotations, setLoading, setError, setSearchTerm]);

    return { fetchQuotations };
};
