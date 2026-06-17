import { useCreatePOInventoryMutation, useDeletePOInventoryMutation } from '../../../../store/api/adminApi';

export const usePOInventoryActions = ({ 
    fetchInventory, setSubmitting, setShowAddModal, setFormData 
}) => {
    
    const [createPOInventory] = useCreatePOInventoryMutation();
    const [deletePOInventory] = useDeletePOInventoryMutation();

    const handleCreateItem = async (formData) => {
        if (!formData.itemName || !formData.supplier) {
            alert('Item name and Supplier are required');
            return;
        }

        try {
            setSubmitting(true);
            await createPOInventory(formData).unwrap();
            setShowAddModal(false);
            fetchInventory();
            setFormData({ itemName: '', sku: '', supplier: '', currentStock: 0, unit: 'Sheets', reorderPoint: 10 });
        } catch (err) {
            alert('Error creating item: ' + (err.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await deletePOInventory(id).unwrap();
            fetchInventory();
        } catch (err) {
            alert('Error deleting item: ' + (err.data?.message || err.message));
        }
    };

    return { handleCreateItem, handleDeleteItem };
};
