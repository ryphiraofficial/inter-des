import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSalesQuotationsQuery } from '../../../../../store/api/salesApi';

export const useQuotationList = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q') || '';

    const { data: quoteRes, isLoading: loading, refetch } = useGetSalesQuotationsQuery();
    
    const quotations = useMemo(() => quoteRes?.success ? quoteRes.data : [], [quoteRes]);

    const filteredQuotations = useMemo(() => {
        return quotations.filter(q => {
            const matchesSearch = (
                q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            const matchesTab = (
                activeTab === 'All' ||
                (activeTab === 'Under Review' && q.status === 'Under Review') ||
                (activeTab === 'Approved' && q.status === 'Approved')
            );

            return matchesSearch && matchesTab;
        });
    }, [quotations, searchTerm, activeTab]);

    return {
        quotations: filteredQuotations,
        allQuotations: quotations,
        loading,
        searchTerm,
        activeTab,
        setActiveTab,
        refresh: refetch
    };
};
