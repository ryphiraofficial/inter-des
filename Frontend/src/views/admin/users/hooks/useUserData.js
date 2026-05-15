import { useEffect } from 'react';
import { userAPI } from '../../../../models/api';

export const useUserData = ({ 
    setUsers, setLoading, setError, setEditingUser, setFormData, setShowModal, setSearchTerm 
}) => {
    
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            if (response.success) setUsers(response.data);
        } catch (err) {
            setError(err.message);
            alert('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();

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
    }, []);

    return { fetchUsers };
};
