import { quotationAPI, uploadAPI, clientAPI } from '../../../../models/api';

export const useQuotationActions = ({ 
    formData, 
    lineItems, 
    taxRate, 
    discount, 
    includeDiscount, 
    offerPrice, 
    isEdit, 
    id, 
    isStaff, 
    navigate, 
    setError, 
    setIsSaving, 
    setShowBillPreview,
    setPendingStatus,
    setClients,
    setShowQuickAddModal,
    setShowExitDialog
}) => {

    const handlePreview = (e, status = 'Under Review') => {
        if (e) e.preventDefault();
        if (!formData.client || !formData.projectName || lineItems.length === 0) {
            setError('Please fill in required fields and add items.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setPendingStatus(status);
        setShowBillPreview(true);
    };

    const handleFinalSave = async (pendingStatus) => {
        try {
            setIsSaving(true);
            const quotationData = {
                ...formData,
                quotationNumber: formData.quoteNumber,
                status: pendingStatus,
                taxRate,
                discount: includeDiscount ? discount : 0,
                offerPrice,
                items: lineItems.map(item => ({
                    itemName: item.name,
                    description: item.description,
                    section: item.section,
                    finish: item.finishBrand,
                    material: item.materialOrigin,
                    size: item.size,
                    unit: item.unit,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                    image: item.image
                }))
            };

            let response;
            if (isEdit) {
                response = await quotationAPI.update(id, quotationData);
            } else {
                response = await quotationAPI.create(quotationData);
            }

            if (response.success) {
                navigate(isStaff ? '/staff/quotations' : '/quotations');
            }
        } catch (err) {
            setError(err.message);
            setShowBillPreview(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setIsSaving(true);
            const quotationData = {
                ...formData,
                quotationNumber: formData.quoteNumber,
                status: 'Draft',
                taxRate,
                discount: includeDiscount ? discount : 0,
                items: lineItems.map(item => ({
                    itemName: item.name,
                    description: item.description,
                    section: item.section,
                    finish: item.finishBrand,
                    material: item.materialOrigin,
                    size: item.size,
                    unit: item.unit,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                    image: item.image
                }))
            };
            let response;
            if (isEdit) {
                response = await quotationAPI.update(id, { ...quotationData, status: 'Draft' });
            } else {
                response = await quotationAPI.create(quotationData);
            }
            if (response.success) {
                setShowExitDialog(false);
                navigate(isStaff ? '/staff/quotations' : '/quotations');
            }
        } catch (err) {
            setError('Failed to save draft: ' + err.message);
            setShowExitDialog(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (itemId, file, updateLineItem) => {
        if (!file) return;
        try {
            const fd = new FormData();
            fd.append('image', file);
            const result = await uploadAPI.image(fd);
            if (result.success) updateLineItem(itemId, 'image', result.data);
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    const confirmQuickAddClient = async (e, quickAddData, selectClient) => {
        e.preventDefault();
        try {
            const res = await clientAPI.create({ ...quickAddData, status: 'Active' });
            if (res.success) {
                const newClient = res.data;
                setClients(prev => [...prev, newClient]);
                selectClient(newClient);
                setShowQuickAddModal(false);
            }
        } catch (err) {
            setError('Failed to create client: ' + err.message);
        }
    };

    return {
        handlePreview,
        handleFinalSave,
        handleSaveDraft,
        handleImageUpload,
        confirmQuickAddClient
    };
};
