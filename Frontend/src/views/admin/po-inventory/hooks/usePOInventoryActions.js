import { useCreatePOInventoryMutation } from '../../../../store/api/adminApi';

export const usePOInventoryActions = ({ 
    fetchInventory, setSubmitting, setShowAddModal, setFormData 
}) => {
    
    const [createPOInventory] = useCreatePOInventoryMutation();

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

    return { handleCreateItem };
};
