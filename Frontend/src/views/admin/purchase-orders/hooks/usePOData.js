import { useEffect } from 'react';
import { useGetPurchaseOrdersQuery } from '../../../../store/api/adminApi';

export const usePOData = ({ 
    setPurchaseOrders, setLoading, setError, setShowCreateModal, setSearchTerm 
}) => {
    
    useEffect(() => {
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);
        return () => window.removeEventListener('header-search', handleHeaderSearch);
    }, [setSearchTerm]);
    
    const { data: poRes, isLoading, error, refetch } = useGetPurchaseOrdersQuery();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Error fetching POs');
            console.error('Error fetching POs:', error);
        }
    }, [error, setError]);

    useEffect(() => {
        if (poRes?.success) setPurchaseOrders(poRes.data);
    }, [poRes, setPurchaseOrders]);

    useEffect(() => {
        const handleOpenCreateModal = () => setShowCreateModal(true);
        window.addEventListener('open-create-po-modal', handleOpenCreateModal);
        
        return () => window.removeEventListener('open-create-po-modal', handleOpenCreateModal);
    }, [setShowCreateModal]);

    return { fetchPurchaseOrders: refetch };
};
