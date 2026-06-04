import { 
    useCreateClientMutation, 
    useUpdateClientMutation, 
    useDeleteClientMutation 
} from '../../../../store/api/adminApi';

export const useClientActions = ({ 
    fetchClients, setSubmitting, setShowNewClientModal, setEditingClient, setFormData, initialFormData 
}) => {
    
    const [createClient] = useCreateClientMutation();
    const [updateClient] = useUpdateClientMutation();
    const [deleteClient] = useDeleteClientMutation();

    const closeModal = () => {
        setShowNewClientModal(false);
        setEditingClient(null);
        setFormData(initialFormData);
    };

    const handleSubmit = async (formData, editingClient) => {
        setSubmitting(true);
        try {
            if (editingClient) {
                await updateClient({ id: editingClient._id, ...formData }).unwrap();
                await fetchClients();
                closeModal();
            } else {
                await createClient(formData).unwrap();
                await fetchClients();
                closeModal();
            }
        } catch (err) {
            alert(err.data?.message || err.message || 'Failed to save client');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            name: client.name || '',
            projectName: client.projectName || '',
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
            await deleteClient(id).unwrap();
            await fetchClients();
        } catch (err) {
            alert('Failed to delete client');
        }
    };

    return { handleSubmit, handleEdit, handleDelete, closeModal };
};
