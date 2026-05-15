import { userAPI } from '../../../../models/api';

export const useUserActions = ({ 
    fetchUsers, setSubmitting, setShowModal, setEditingUser, setFormData, setUsers, users 
}) => {
    
    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'Admin',
            department: user.department || 'Admin',
            password: ''
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'role') {
            let dept = 'Admin';
            if (value.includes('Design')) dept = 'Design';
            else if (value.includes('Procurement')) dept = 'Procurement';
            else if (value.includes('Production') || value.includes('Project') || value.includes('Site')) dept = 'Production';
            else if (value.includes('Accounts')) dept = 'Accounts';
            else if (value === 'Sales') dept = 'Sales';
            
            setFormData(prev => ({ ...prev, role: value, department: dept }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (formData, editingUser) => {
        if (!formData.fullName || !formData.email || (!editingUser && !formData.password)) {
            alert('Name, Email and Password are required');
            return;
        }

        try {
            setSubmitting(true);
            const response = editingUser
                ? await userAPI.update(editingUser._id, formData)
                : await userAPI.create(formData);

            if (response.success) {
                alert(editingUser ? 'User updated successfully' : 'New user created successfully');
                setShowModal(false);
                fetchUsers();
                setEditingUser(null);
                setFormData({ fullName: '', email: '', phone: '', role: 'Admin', department: 'Admin', password: '' });
            }
        } catch (err) {
            alert(err.message || `Error ${editingUser ? 'updating' : 'creating'} user`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const response = await userAPI.delete(id);
            if (response.success) {
                setUsers(users.filter(u => u._id !== id));
                alert('User deleted successfully');
            }
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    return { handleEditClick, handleInputChange, handleSubmit, handleDelete };
};
