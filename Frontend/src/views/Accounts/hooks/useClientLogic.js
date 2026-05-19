import { useState, useEffect } from 'react';
import { clientAPI } from '../../../models/api';

export const useClientLogic = (parentSearch, parentSetSearch) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [showModal, setShowModal] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', gstNumber: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchClients();
        const handleOpenModal = () => openCreate();
        window.addEventListener('open-create-client-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-client-modal', handleOpenModal);
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const res = await clientAPI.getAll();
            if (res?.success) setClients(res.data || []);
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

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
            setSubmitting(true);
            let res;
            if (editClient) {
                res = await clientAPI.update(editClient._id, form);
            } else {
                res = await clientAPI.create(form);
            }
            if (res?.success) {
                setShowModal(false);
                fetchClients();
            }
        } catch (err) {
            alert('Error saving client: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this client?')) return;
        try {
            await clientAPI.delete(id);
            setClients(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
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
