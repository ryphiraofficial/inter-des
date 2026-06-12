import { 
    useCreateClientMutation, 
    useUpdateClientMutation, 
    useDeleteClientMutation 
} from '../../../../store/api/adminApi';

export const useClientActions = ({ 
    fetchClients, setSubmitting, setShowNewClientModal, setEditingClient, setFormData, initialFormData,
    clientToDelete, setClientToDelete, setIsDeleting
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
            dateOfBirth: client.dateOfBirth ? client.dateOfBirth.split('T')[0] : '',
            status: client.status || 'Active'
        });
        setShowNewClientModal(true);
    };

    const handleDelete = (client) => {
        setClientToDelete(client);
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;
        setIsDeleting(true);
        try {
            await deleteClient(clientToDelete._id).unwrap();
            await fetchClients();
            setClientToDelete(null);
        } catch (err) {
            alert('Failed to delete client');
        } finally {
            setIsDeleting(false);
        }
    };

    return { handleSubmit, handleEdit, handleDelete, confirmDelete, closeModal };
};
