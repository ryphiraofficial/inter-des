import { useEffect } from 'react';
import { invoiceAPI, clientAPI } from '../../../../models/api';

export const useInvoiceData = ({ 
    setInvoices, setClients, setLoading, setError, setSearchTerm, setShowCreateModal 
}) => {
    
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoiceAPI.getAll();
            if (response.success) setInvoices(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await clientAPI.getAll();
            if (response.success) setClients(response.data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchClients();

        const handleOpenModal = () => setShowCreateModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-invoice-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-invoice-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    return { fetchInvoices, fetchClients };
};
