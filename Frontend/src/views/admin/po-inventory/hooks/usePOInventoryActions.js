import { poInventoryAPI } from '../../../../models/api';

export const usePOInventoryActions = ({ 
    fetchInventory, setSubmitting, setShowAddModal, setFormData 
}) => {
    
    const handleCreateItem = async (formData) => {
        if (!formData.itemName || !formData.supplier) {
            alert('Item name and Supplier are required');
            return;
        }

        try {
            setSubmitting(true);
            const response = await poInventoryAPI.create(formData);
            if (response.success) {
                setShowAddModal(false);
                fetchInventory();
                setFormData({ itemName: '', sku: '', supplier: '', currentStock: 0, unit: 'Sheets', reorderPoint: 10 });
            }
        } catch (err) {
            alert('Error creating item: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return { handleCreateItem };
};
