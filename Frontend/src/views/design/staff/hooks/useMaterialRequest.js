import { useState } from 'react';
import { useCreateMaterialRequestMutation } from '../../../../store/api/procurementApi';

export const useMaterialRequest = () => {
    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [submittingMaterial, setSubmittingMaterial] = useState(false);
    const [materialFormData, setMaterialFormData] = useState({
        project: '', quotation: '', items: [], priority: 'Medium', notes: ''
    });

    const [createMaterialRequest] = useCreateMaterialRequestMutation();

    const handleOpenMaterialModal = (task) => {
        const quotationId = task.quotation?._id || task.quotation;
        const projectId = task.project?._id || task.project || quotationId;
        const quotation = task.quotation || task.project;
        const items = quotation?.items?.map(item => ({
            itemName: item.itemName,
            description: item.description || '',
            quantity: item.quantity,
            unit: item.unit || 'pieces',
            specifications: item.specifications || '',
            isExtra: false
        })) || [];

        setMaterialFormData({ project: projectId, quotation: quotationId, items, priority: task.priority || 'Medium', notes: '' });
        setShowMaterialModal(true);
    };

    const handleAddExtraItem = () => {
        setMaterialFormData(prev => ({
            ...prev,
            items: [...prev.items, { itemName: '', description: '', quantity: 1, unit: 'pieces', specifications: '', isExtra: true, reasonForExtra: '' }]
        }));
    };

    const handleRemoveItem = (index) => {
        setMaterialFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const handleUpdateItem = (index, field, value) => {
        setMaterialFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const handleSubmitMaterialRequest = async () => {
        if (materialFormData.items.length === 0) return alert('Please add at least one item');
        try {
            setSubmittingMaterial(true);
            await createMaterialRequest(materialFormData).unwrap();
            alert('Material request submitted successfully!');
            setShowMaterialModal(false);
            setMaterialFormData({ project: '', quotation: '', items: [], priority: 'Medium', notes: '' });
            return true;
        } catch (err) {
            alert('Request failed: ' + (err.data?.message || err.message));
        } finally {
            setSubmittingMaterial(false);
        }
        return false;
    };

    return {
        showMaterialModal, setShowMaterialModal,
        submittingMaterial,
        materialFormData, setMaterialFormData,
        handleOpenMaterialModal, handleAddExtraItem,
        handleRemoveItem, handleUpdateItem, handleSubmitMaterialRequest
    };
};
