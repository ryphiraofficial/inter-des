import { useNavigate } from 'react-router-dom';

export const useQuotationViewActions = ({ isStaff, id }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(isStaff ? '/staff/quotations' : '/quotations');
    };

    const handleEdit = () => {
        navigate(isStaff ? `/staff/quotations/edit/${id}` : `/quotations/edit/${id}`);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Future: PDF Download logic
        alert('Download feature coming soon');
    };

    return { handleBack, handleEdit, handlePrint, handleDownload };
};
