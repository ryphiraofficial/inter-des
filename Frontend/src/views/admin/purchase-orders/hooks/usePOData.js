import { useEffect } from 'react';
import { purchaseOrderAPI } from '../../../../models/api';

export const usePOData = ({ 
    setPurchaseOrders, setLoading, setError, setShowCreateModal 
}) => {
    
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
