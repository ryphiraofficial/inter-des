import { useEffect } from 'react';
import { staffAPI } from '../../../../models/api';

export const useStaffData = ({ 
    setStaffList, setLoading, setError, showToast, setShowModal, setSearchTerm 
}) => {
    
    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffAPI.getAll();
            if (response.success) setStaffList(response.data);
        } catch (err) {
            setError(err.message);
            showToast('Failed to load staff list', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
        const handleOpenStaffModal = () => setShowModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-staff-modal', handleOpenStaffModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-staff-modal', handleOpenStaffModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    return { fetchStaff };
};
