import { useEffect } from 'react';
import { useGetPOInventoryQuery } from '../../../../store/api/adminApi';

export const usePOInventoryData = ({ setInventory, setLoading, setError, setShowAddModal }) => {
    
    const { data: poInvRes, isLoading, error, refetch } = useGetPOInventoryQuery();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Error fetching PO inventory');
            console.error('Error fetching PO inventory:', error);
        }
    }, [error, setError]);

    useEffect(() => {
        if (poInvRes?.success) {
            setInventory(poInvRes.data);
        }
    }, [poInvRes, setInventory]);

    useEffect(() => {
        const handleOpenModal = () => setShowAddModal(true);
        window.addEventListener('open-po-inventory-modal', handleOpenModal);
        
        return () => window.removeEventListener('open-po-inventory-modal', handleOpenModal);
    }, [setShowAddModal]);

    return { fetchInventory: refetch };
};
