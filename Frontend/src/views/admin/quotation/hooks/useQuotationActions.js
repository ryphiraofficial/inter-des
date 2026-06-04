import { 
    useCreateQuotationMutation, 
    useUpdateQuotationMutation,
    useCreateClientMutation 
} from '../../../../store/api/adminApi';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';

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
    setShowExitDialog,
    setFieldErrors
}) => {
    
    const [createQuotation] = useCreateQuotationMutation();
    const [updateQuotation] = useUpdateQuotationMutation();
    const [createClient] = useCreateClientMutation();

    const handlePreview = (e, status = 'Under Review') => {
        if (e) e.preventDefault();
        
        const errors = {};
        if (!formData.client) {
            errors.client = 'Client is required.';
        }
        if (!formData.projectName) {
            errors.projectName = 'Project name is required.';
        }
        if (!lineItems || lineItems.length === 0) {
            errors.lineItems = 'Please add at least one line item.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError('Please correct the highlighted fields before proceeding.');
            
            setTimeout(() => {
                const firstErrorKey = Object.keys(errors)[0];
                const element = document.getElementById(`${firstErrorKey}-field-group`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const input = element.querySelector('input, textarea, select');
                    if (input) input.focus();
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100);
            return;
        }

        setFieldErrors({});
        setError(null);
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
                    cmL: item.cmL,
                    cmD: item.cmD,
                    cmH: item.cmH,
                    unit: item.unit,
                    quantity: item.quantity,
                    rate: item.rate,
                    costPrice: item.costPrice || 0,
                    amount: item.amount,
                    image: item.image
                }))
            };

            if (isEdit) {
                await updateQuotation({ id, ...quotationData }).unwrap();
            } else {
                await createQuotation(quotationData).unwrap();
            }

            navigate(isStaff ? '/staff/quotations' : '/quotations');
        } catch (err) {
            setError(err.data?.message || err.message);
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
                    cmL: item.cmL,
                    cmD: item.cmD,
                    cmH: item.cmH,
                    unit: item.unit,
                    quantity: item.quantity,
                    rate: item.rate,
                    costPrice: item.costPrice || 0,
                    amount: item.amount,
                    image: item.image
                }))
            };
            
            if (isEdit) {
                await updateQuotation({ id, ...quotationData, status: 'Draft' }).unwrap();
            } else {
                await createQuotation(quotationData).unwrap();
            }
            
            setShowExitDialog(false);
            navigate(isStaff ? '/staff/quotations' : '/quotations');
        } catch (err) {
            setError('Failed to save draft: ' + (err.data?.message || err.message));
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
            const result = await uploadImage(fd).unwrap();
            if (result.success) updateLineItem(itemId, 'image', result.data);
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    const confirmQuickAddClient = async (e, quickAddData, selectClient) => {
        e.preventDefault();
        try {
            const newClient = await createClient({ ...quickAddData, status: 'Active' }).unwrap();
            // Assuming the RTK query mutation might return data directly or nested in `data` depending on transformResponse, but .unwrap() usually gives the direct payload. Wait, previous models/api returned {success, data}. If the backend still returns {success, data}, then .unwrap() returns that object. Let's see:
            // if newClient has `.data`, we extract it.
            const clientData = newClient.data ? newClient.data : newClient;
            
            setClients(prev => [...prev, clientData]);
            selectClient(clientData);
            setShowQuickAddModal(false);
        } catch (err) {
            setError('Failed to create client: ' + (err.data?.message || err.message));
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
