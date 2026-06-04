import { 
    useCreateSalesQuotationMutation, 
    useUpdateSalesQuotationMutation,
    useCreateSalesClientMutation 
} from '../../../../store/api/salesApi';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';

export const useQuotationActions = ({
    formData, lineItems, taxRate, discount, includeDiscount, offerPrice,
    isEdit, id, isStaff, navigate, setError, setIsSaving, setShowBillPreview,
    setPendingStatus, setClients, setShowQuickAddModal, setShowExitDialog,
    setFieldErrors
}) => {
    const [createQuotation] = useCreateSalesQuotationMutation();
    const [updateQuotation] = useUpdateSalesQuotationMutation();
    const [createClient] = useCreateSalesClientMutation();
    const [uploadImage] = useUploadImageMutation();
    
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

    const handleFinalSave = async (status) => {
        try {
            setIsSaving(true);
            const quotationData = {
                ...formData,
                quotationNumber: formData.quoteNumber,
                status: status || 'Under Review',
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

            let response;
            if (isEdit) {
                response = await updateQuotation({ id, ...quotationData }).unwrap();
            } else {
                response = await createQuotation(quotationData).unwrap();
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
            
            let response;
            if (isEdit) {
                response = await updateQuotation({ id, ...quotationData, status: 'Draft' }).unwrap();
            } else {
                response = await createQuotation(quotationData).unwrap();
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

    const confirmQuickAddClient = async (e, quickAddData, selectClient) => {
        e.preventDefault();
        try {
            const res = await createClient({ ...quickAddData, status: 'Active' }).unwrap();
            if (res.success) {
                const newClient = res.data;
                setClients(prev => [...prev, newClient]);
                selectClient(newClient);
                setShowQuickAddModal(false);
                setError(null);
            }
        } catch (err) {
            setError('Failed to create client: ' + err.message);
        }
    };

    const handleImageUpload = async (itemId, file, updateLineItem) => {
        if (!file) return;
        try {
            const uploadForm = new FormData();
            uploadForm.append('image', file);
            const result = await uploadImage(uploadForm).unwrap();
            if (result.success) updateLineItem(itemId, 'image', result.data);
        } catch (err) {
            console.error('Upload error:', err);
        }
    };

    return {
        handlePreview,
        handleFinalSave,
        handleSaveDraft,
        confirmQuickAddClient,
        handleImageUpload
    };
};
