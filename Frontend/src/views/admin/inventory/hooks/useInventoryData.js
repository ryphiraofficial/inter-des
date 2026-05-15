import { useEffect } from 'react';
import { inventoryAPI } from '../../../../models/api';

export const useInventoryData = ({ 
    setItems, setLoading, setError, setSearchTerm, setShowItemModal, setFormData 
}) => {
    
    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await inventoryAPI.getAll();
            if (response.success) setItems(response.data);
        } catch (err) {
            setError(err.message);
            alert('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();

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
    }, []);

    return { fetchItems };
};
