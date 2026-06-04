import { useState, useEffect } from 'react';
import {
    useGetAccountsClientsQuery,
    useCreateAccountsClientMutation,
    useUpdateAccountsClientMutation,
    useDeleteAccountsClientMutation
} from '../../../store/api/accountsApi';

export const useClientLogic = (parentSearch, parentSetSearch) => {
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [showModal, setShowModal] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', gstNumber: '' });

    const { data: clientRes, isLoading: loading } = useGetAccountsClientsQuery();
    const [createClient, { isLoading: isCreating }] = useCreateAccountsClientMutation();
    const [updateClient, { isLoading: isUpdating }] = useUpdateAccountsClientMutation();
    const [deleteClient] = useDeleteAccountsClientMutation();

    const submitting = isCreating || isUpdating;
    const clients = clientRes?.success ? clientRes.data : [];

    useEffect(() => {
        const handleOpenModal = () => openCreate();
        window.addEventListener('open-create-client-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-client-modal', handleOpenModal);
    }, []);

    const openCreate = () => {
        setEditClient(null);
        setForm({ name: '', email: '', phone: '', address: '', gstNumber: '' });
        setShowModal(true);
    };

    const openEdit = (client) => {
        setEditClient(client);
        setForm({ name: client.name || '', email: client.email || '', phone: client.phone || '', address: client.address || '', gstNumber: client.gstNumber || '' });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name) return alert('Client name is required');
        try {
            if (editClient) {
                await updateClient({ id: editClient._id, ...form }).unwrap();
            } else {
                await createClient(form).unwrap();
            }
            setShowModal(false);
        } catch (err) {
            alert('Error saving client: ' + (err.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this client?')) return;
        try {
            await deleteClient(id).unwrap();
        } catch (err) {
            alert('Error deleting: ' + (err.data?.message || err.message));
        }
    };

    const filtered = clients.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    return {
        clients, loading, search, setSearch, showModal, setShowModal,
        editClient, form, setForm, submitting, filtered, handleSubmit, handleDelete, openEdit
    };
};
