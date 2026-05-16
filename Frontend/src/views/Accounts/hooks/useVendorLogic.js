import { useState, useEffect } from 'react';
import { vendorAPI } from '../../../models/api';

export const useVendorLogic = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editVendor, setEditVendor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', category: '', gstNumber: '' });

    useEffect(() => {
        fetchVendors();
        const handleOpenModal = () => openCreate();
        window.addEventListener('open-create-vendor-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-vendor-modal', handleOpenModal);
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await vendorAPI.getAll();
            if (res?.success) setVendors(res.data || []);
        } catch (err) {
            console.error('Error fetching vendors:', err);
        } finally {
            setLoading(false);
        }
    };

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
            setSubmitting(true);
            let res;
            if (editVendor) {
                res = await vendorAPI.update(editVendor._id, form);
            } else {
                res = await vendorAPI.create(form);
            }
            if (res?.success) {
                setShowModal(false);
                fetchVendors();
            }
        } catch (err) {
            alert('Error saving vendor: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vendor?')) return;
        try {
            await vendorAPI.delete(id);
            setVendors(prev => prev.filter(v => v._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
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
