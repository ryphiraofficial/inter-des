import { useEffect } from 'react';
import { useGetInvoicesQuery, useGetClientsQuery } from '../../../../store/api/adminApi';

export const useInvoiceData = ({ 
    setInvoices, setClients, setLoading, setError, setSearchTerm, setShowCreateModal 
}) => {
    
    const { data: invRes, isLoading: invLoading, error: invError, refetch } = useGetInvoicesQuery();
    const { data: clientsRes } = useGetClientsQuery();

    useEffect(() => {
        setLoading(invLoading);
    }, [invLoading, setLoading]);

    useEffect(() => {
        if (invError) setError(invError.message || 'Error fetching invoices');
    }, [invError, setError]);

    useEffect(() => {
        if (invRes?.success) setInvoices(invRes.data);
        if (clientsRes?.success) setClients(clientsRes.data);
    }, [invRes, clientsRes, setInvoices, setClients]);

    useEffect(() => {
        const handleOpenModal = () => setShowCreateModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-invoice-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-invoice-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setShowCreateModal, setSearchTerm]);

    return { fetchInvoices: refetch, fetchClients: () => {} };
};
