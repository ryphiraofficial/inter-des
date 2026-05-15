import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quotationAPI } from '../../../../../models/api';

export const useQuotationList = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await quotationAPI.getAll();
            if (response.success) setQuotations(response.data);
        } catch (err) {
            console.error('Failed to load quotations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const filteredQuotations = useMemo(() => {
        return quotations.filter(q =>
            q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quotations, searchTerm]);

    return {
        quotations: filteredQuotations,
        loading,
        searchTerm,
        refresh: fetchQuotations
    };
};
