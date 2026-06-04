import { useApproveQuotationMutation, useDeleteQuotationMutation } from '../../../../../store/api/adminApi';

export const useQuotationListActions = ({ 
    fetchQuotations, setSubmitting, setExpandedRow, expandedRow 
}) => {
    
    const [approveQuotation] = useApproveQuotationMutation();
    const [deleteQuotation] = useDeleteQuotationMutation();

    const handleApprove = async (id, designManagerId) => {
        setSubmitting(true);
        try {
            await approveQuotation({ id, designManagerId }).unwrap();
            alert('Quotation approved successfully and project initialized');
            fetchQuotations();
        } catch (err) {
            alert(err.data?.message || err.message || 'Failed to approve');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return;
        setSubmitting(true);
        try {
            await deleteQuotation(id).unwrap();
            alert('Quotation deleted successfully');
            fetchQuotations();
        } catch (err) {
            alert(err.data?.message || err.message || 'Failed to delete');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return { handleApprove, handleDelete, toggleRow };
};
