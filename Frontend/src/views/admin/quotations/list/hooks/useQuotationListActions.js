import { quotationAPI } from '../../../../../models/api';

export const useQuotationListActions = ({ 
    fetchQuotations, setSubmitting, setExpandedRow, expandedRow 
}) => {
    
    const handleApprove = async (id, designManagerId) => {
        setSubmitting(true);
        try {
            const response = await quotationAPI.approve(id, { designManagerId });
            if (response.success) {
                alert('Quotation approved successfully and project initialized');
                fetchQuotations();
            }
        } catch (err) {
            alert(err.message || 'Failed to approve');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return;
        setSubmitting(true);
        try {
            const response = await quotationAPI.delete(id);
            if (response.success) {
                alert('Quotation deleted successfully');
                fetchQuotations();
            }
        } catch (err) {
            alert(err.message || 'Failed to delete');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return { handleApprove, handleDelete, toggleRow };
};
