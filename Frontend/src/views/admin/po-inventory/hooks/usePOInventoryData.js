import { useEffect } from 'react';
import { poInventoryAPI } from '../../../../models/api';

export const usePOInventoryData = ({ setInventory, setLoading, setError, setShowAddModal }) => {
    
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await poInventoryAPI.getAll();
            if (response.success) {
                setInventory(response.data);
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching PO inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();

        const handleOpenModal = () => setShowAddModal(true);
        window.addEventListener('open-po-inventory-modal', handleOpenModal);
        
        return () => window.removeEventListener('open-po-inventory-modal', handleOpenModal);
    }, []);

    return { fetchInventory };
};
