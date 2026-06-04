import { 
    useCreateInventoryMutation, 
    useUpdateInventoryMutation, 
    useDeleteInventoryMutation 
} from '../../../../store/api/adminApi';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';

export const useInventoryActions = ({ 
    fetchItems, setSubmitting, setShowItemModal, setEditingItem, setFormData, initialFormData, 
    setAvailableSections, availableSections, setIsAddingSection, setNewSectionName 
}) => {
    
    const [createInventory] = useCreateInventoryMutation();
    const [updateInventory] = useUpdateInventoryMutation();
    const [deleteInventory] = useDeleteInventoryMutation();
    const [uploadImage] = useUploadImageMutation();

    const handleImageUpload = async (file) => {
        if (!file) return;
        try {
            setSubmitting(true);
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            const response = await uploadImage(uploadFormData).unwrap();
            if (response.success) {
                const imageUrl = response.data || response.url;
                setFormData(prev => ({ ...prev, image: imageUrl }));
                alert('Image uploaded successfully');
            }
        } catch (err) {
            alert('Image upload failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e, formData, editingItem) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            if (editingItem) {
                await updateInventory({ id: editingItem._id, ...formData }).unwrap();
                await fetchItems();
                alert('Item updated successfully');
                closeModal();
            } else {
                await createInventory(formData).unwrap();
                await fetchItems();
                alert('New item added to inventory');
                closeModal();
            }
        } catch (err) {
            alert(err.data?.message || err.message || 'Failed to save item');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await deleteInventory(id).unwrap();
            await fetchItems();
            alert('Item removed from inventory');
        } catch (err) {
            alert('Failed to delete item');
        }
    };

    const handleAddSection = (newSectionName) => {
        if (!newSectionName.trim()) return;
        if (!availableSections.includes(newSectionName)) {
            setAvailableSections([...availableSections, newSectionName]);
            setFormData(prev => ({ ...prev, section: newSectionName }));
            alert(`New section "${newSectionName}" added`);
        }
        setNewSectionName('');
        setIsAddingSection(false);
    };

    const closeModal = () => {
        setShowItemModal(false);
        setEditingItem(null);
        setFormData(initialFormData);
    };

    return { handleImageUpload, handleSubmit, handleDelete, handleAddSection, closeModal };
};
