import { useEffect } from 'react';
import { useGetClientsQuery } from '../../../../store/api/adminApi';

export const useClientData = ({ 
    setClients, setLoading, setError, setShowNewClientModal, setSearchTerm 
}) => {
    
    const { data: clientsRes, isLoading, error, refetch } = useGetClientsQuery();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Error fetching clients');
        }
    }, [error, setError]);

    useEffect(() => {
        if (clientsRes?.success) {
            setClients(clientsRes.data);
        }
    }, [clientsRes, setClients]);

    useEffect(() => {
        const handleOpenClientModal = () => setShowNewClientModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-client-modal', handleOpenClientModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-client-modal', handleOpenClientModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setShowNewClientModal, setSearchTerm]);

    return { fetchClients: refetch };
};
