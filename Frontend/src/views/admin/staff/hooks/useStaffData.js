import { useEffect } from 'react';
import { useGetStaffQuery } from '../../../../store/api/adminApi';

export const useStaffData = ({ 
    setStaffList, setLoading, setError, showToast, setShowModal, setSearchTerm 
}) => {
    
    const { data: staffRes, isLoading, error, refetch } = useGetStaffQuery();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Error fetching staff');
            showToast('Failed to load staff list', 'error');
        }
    }, [error, setError, showToast]);

    useEffect(() => {
        if (staffRes?.success) setStaffList(staffRes.data);
    }, [staffRes, setStaffList]);

    useEffect(() => {
        const handleOpenStaffModal = () => setShowModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-staff-modal', handleOpenStaffModal);
        window.addEventListener('header-search', handleHeaderSearch);

        return () => {
            window.removeEventListener('open-create-staff-modal', handleOpenStaffModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setShowModal, setSearchTerm]);

    return { fetchStaff: refetch };
};
