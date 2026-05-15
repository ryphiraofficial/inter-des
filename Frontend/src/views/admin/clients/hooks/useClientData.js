import { useEffect } from 'react';
import { clientAPI } from '../../../../models/api';

export const useClientData = ({ 
    setClients, setLoading, setError, setShowNewClientModal, setSearchTerm 
}) => {
    
    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientAPI.getAll();
            if (response.success) {
                setClients(response.data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();

        const handleOpenClientModal = () => setShowNewClientModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-client-modal', handleOpenClientModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-client-modal', handleOpenClientModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    return { fetchClients };
};
