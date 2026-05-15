import { clientAPI } from '../../../../models/api';

export const useClientActions = ({ 
    fetchClients, setSubmitting, setShowNewClientModal, setEditingClient, setFormData, initialFormData 
}) => {
    
    const closeModal = () => {
        setShowNewClientModal(false);
        setEditingClient(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (formData, editingClient) => {
        setSubmitting(true);
        try {
            if (editingClient) {
                const response = await clientAPI.update(editingClient._id, formData);
                if (response.success) {
                    await fetchClients();
                    closeModal();
                }
            } else {
                const response = await clientAPI.create(formData);
                if (response.success) {
                    await fetchClients();
                    closeModal();
                }
            }
        } catch (err) {
            alert(err.message || 'Failed to save client');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name || '',
            email: client.email || '',
            phone: client.phone || '',
            address: client.address || '',
            siteAddress: client.siteAddress || '',
            billingAddress: client.billingAddress || '',
            billingPincode: client.billingPincode || '',
            contact1: client.contact1 || '',
            contact2: client.contact2 || '',
            status: client.status || 'Active'
        });
        setShowNewClientModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;
        try {
            const response = await clientAPI.delete(id);
            if (response.success) {
                await fetchClients();
            }
        } catch (err) {
            alert('Failed to delete client');
        }
    };

    return { handleSubmit, handleEdit, handleDelete, closeModal };
};
