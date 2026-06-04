import { useEffect } from 'react';
import { useGetInventoryQuery } from '../../../../store/api/adminApi';

export const useInventoryData = ({ 
    setItems, setLoading, setError, setSearchTerm, setShowItemModal, setFormData 
}) => {
    
    const { data: inventoryRes, isLoading, error, refetch } = useGetInventoryQuery({ limit: 1000 });

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Failed to load inventory');
            alert('Failed to load inventory');
        }
    }, [error, setError]);

    useEffect(() => {
        if (inventoryRes?.success) setItems(inventoryRes.data);
    }, [inventoryRes, setItems]);

    useEffect(() => {
        const processAIData = (data) => {
            if (!data) return;
            setFormData(prev => ({ ...prev, ...data }));
            setShowItemModal(true);
        };

        const handleAIPopulate = (e) => processAIData(e.detail);
        const handleOpenModal = () => setShowItemModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        const pending = sessionStorage.getItem('AI_PENDING_DATA');
        if (pending) {
            const { type, data } = JSON.parse(pending);
            if (type === 'INVENTORY') {
                processAIData(data);
                sessionStorage.removeItem('AI_PENDING_DATA');
            }
        }

        window.addEventListener('AI_POPULATE_INVENTORY', handleAIPopulate);
        window.addEventListener('open-inventory-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('AI_POPULATE_INVENTORY', handleAIPopulate);
            window.removeEventListener('open-inventory-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setFormData, setShowItemModal, setSearchTerm]);

    return { fetchItems: refetch };
};
