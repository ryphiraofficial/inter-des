import { useState, useEffect } from 'react';
import {
    useGetPaymentsQuery,
    useCreatePaymentMutation,
    useDeletePaymentMutation,
    useGetAccountsClientsQuery
} from '../../../store/api/accountsApi';

export const usePaymentLogic = (parentSearch, parentSetSearch) => {
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        client: '', amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer', reference: ''
    });

    const { data: payRes, isLoading: payLoading } = useGetPaymentsQuery({ limit: 50 });
    const { data: clientRes, isLoading: clientLoading } = useGetAccountsClientsQuery();

    const [createPayment, { isLoading: submitting }] = useCreatePaymentMutation();
    const [deletePayment] = useDeletePaymentMutation();

    const loading = payLoading || clientLoading;
    const payments = payRes?.success ? payRes.data : [];
    const clients = clientRes?.success ? clientRes.data : [];

    useEffect(() => {
        const handleOpenModal = () => setShowModal(true);
        window.addEventListener('open-create-payment-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-payment-modal', handleOpenModal);
    }, []);

    const handleSubmit = async () => {
        if (!form.client || !form.amount) return alert('Client and amount are required');
        try {
            await createPayment({ ...form, amount: parseFloat(form.amount) }).unwrap();
            setShowModal(false);
            setForm({ client: '', amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'Bank Transfer', reference: '' });
        } catch (err) {
            alert('Error saving payment: ' + (err.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this payment record?')) return;
        try {
            await deletePayment(id).unwrap();
        } catch (err) {
            alert('Error deleting: ' + (err.data?.message || err.message));
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
