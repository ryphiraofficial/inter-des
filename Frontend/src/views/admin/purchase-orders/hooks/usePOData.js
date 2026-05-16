import { useEffect } from 'react';
import { purchaseOrderAPI } from '../../../../models/api';

export const usePOData = ({ 
    setPurchaseOrders, setLoading, setError, setShowCreateModal, setSearchTerm 
}) => {
    
    useEffect(() => {
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);
        return () => window.removeEventListener('header-search', handleHeaderSearch);
    }, [setSearchTerm]);
    
    const fetchPurchaseOrders = async () => {
        try {
            setLoading(true);
            const response = await purchaseOrderAPI.getAll();
            if (response.success) {
                setPurchaseOrders(response.data);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching POs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchaseOrders();
        
        const handleOpenCreateModal = () => setShowCreateModal(true);
        window.addEventListener('open-create-po-modal', handleOpenCreateModal);
        
        return () => window.removeEventListener('open-create-po-modal', handleOpenCreateModal);
    }, []);

    return { fetchPurchaseOrders };
};
