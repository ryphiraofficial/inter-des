import { useState, useEffect } from 'react';
import { accountsAPI, clientAPI } from '../../../models/api';

export const usePaymentLogic = (parentSearch, parentSetSearch) => {
    const [payments, setPayments] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        client: '', amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer', reference: ''
    });

    useEffect(() => {
        fetchData();
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-payment-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-payment-modal', handleOpenModal);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [payRes, clientRes] = await Promise.all([
                accountsAPI.getPayments({ limit: 50 }),
                clientAPI.getAll()
            ]);
            if (payRes?.success) setPayments(payRes.data || []);
            if (clientRes?.success) setClients(clientRes.data || []);
        } catch (err) {
            console.error('Error fetching payments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.client || !form.amount) return alert('Client and amount are required');
        try {
            setSubmitting(true);
            const res = await accountsAPI.createPayment({ ...form, amount: parseFloat(form.amount) });
            if (res?.success) {
                setShowModal(false);
                fetchData();
                setForm({ client: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'Bank Transfer', reference: '' });
            }
        } catch (err) {
            alert('Error saving payment: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this payment record?')) return;
        try {
            await accountsAPI.deletePayment(id);
            setPayments(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    const filtered = payments.filter(p =>
        p.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase())
    );

    return {
        payments, clients, loading, search, setSearch, showModal, setShowModal,
        submitting, form, setForm, filtered, handleSubmit, handleDelete
    };
};
