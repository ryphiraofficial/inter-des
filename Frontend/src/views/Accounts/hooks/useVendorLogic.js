import { useState, useEffect } from 'react';
import {
    useGetVendorsQuery,
    useCreateVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation
} from '../../../store/api/accountsApi';

export const useVendorLogic = (parentSearch, parentSetSearch) => {
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    
    const [showModal, setShowModal] = useState(false);
    const [editVendor, setEditVendor] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', category: '', gstNumber: '' });

    const { data: vendorRes, isLoading: loading } = useGetVendorsQuery();
    const [createVendor, { isLoading: isCreating }] = useCreateVendorMutation();
    const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();
    const [deleteVendor] = useDeleteVendorMutation();

    const submitting = isCreating || isUpdating;
    const vendors = vendorRes?.success ? vendorRes.data : [];

    useEffect(() => {
        const handleOpenModal = () => openCreate();
        window.addEventListener('open-create-vendor-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-vendor-modal', handleOpenModal);
    }, []);

    const openCreate = () => {
        setEditVendor(null);
        setForm({ name: '', email: '', phone: '', address: '', category: '', gstNumber: '' });
        setShowModal(true);
    };

    const openEdit = (v) => {
        setEditVendor(v);
        setForm({ name: v.name || '', email: v.email || '', phone: v.phone || '', address: v.address || '', category: v.category || '', gstNumber: v.gstNumber || '' });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name) return alert('Vendor name is required');
        try {
            if (editVendor) {
                await updateVendor({ id: editVendor._id, ...form }).unwrap();
            } else {
                await createVendor(form).unwrap();
            }
            setShowModal(false);
        } catch (err) {
            alert('Error saving vendor: ' + (err.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vendor?')) return;
        try {
            await deleteVendor(id).unwrap();
        } catch (err) {
            alert('Error deleting: ' + (err.data?.message || err.message));
        }
    };

    const filtered = vendors.filter(v =>
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.category?.toLowerCase().includes(search.toLowerCase()) ||
        v.email?.toLowerCase().includes(search.toLowerCase())
    );

    return {
        loading, search, setSearch, showModal, setShowModal, editVendor, submitting, form, setForm, filtered, handleSubmit, handleDelete, openEdit
    };
};
