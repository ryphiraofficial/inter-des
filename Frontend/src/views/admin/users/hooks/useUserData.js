import { useEffect } from 'react';
import { useGetUsersQuery } from '../../../../store/api/adminApi';

export const useUserData = ({ 
    setUsers, setLoading, setError, setEditingUser, setFormData, setShowModal, setSearchTerm 
}) => {
    
    const { data: usersRes, isLoading, error, refetch } = useGetUsersQuery();

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (error) {
            setError(error.message || 'Error fetching users');
            alert('Failed to load team members');
        }
    }, [error, setError]);

    useEffect(() => {
        if (usersRes?.success) setUsers(usersRes.data);
    }, [usersRes, setUsers]);

    useEffect(() => {
        const handleOpenModal = () => {
            setEditingUser(null);
            setFormData({ fullName: '', email: '', phone: '', role: 'Designer', password: '', department: 'Design' });
            setShowModal(true);
        };

        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');

        window.addEventListener('open-create-user-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);
        
        return () => {
            window.removeEventListener('open-create-user-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [setEditingUser, setFormData, setShowModal, setSearchTerm]);

    return { fetchUsers: refetch };
};
