import { useState, useEffect } from 'react';
import {
    useGetAccountsInvoicesQuery,
    useCreateAccountsInvoiceMutation,
    useUpdateAccountsInvoicePaymentMutation,
    useDeleteAccountsInvoiceMutation,
    useGetAccountsClientsQuery
} from '../../../store/api/accountsApi';

export const useInvoiceLogic = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [formData, setFormData] = useState({
        client: '',
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        subTotal: 0,
        tax: 0,
        totalAmount: 0,
        notes: '',
        status: 'Sent'
    });

    const { data: invRes, isLoading: loadingInv, error: errInv } = useGetAccountsInvoicesQuery();
    const { data: clientsRes } = useGetAccountsClientsQuery();

    const [createInvoice, { isLoading: isCreating }] = useCreateAccountsInvoiceMutation();
    const [updatePayment] = useUpdateAccountsInvoicePaymentMutation();
    const [deleteInvoice] = useDeleteAccountsInvoiceMutation();

    const loading = loadingInv;
    const submitting = isCreating;
    const error = errInv ? (errInv.data?.message || errInv.message) : null;

    const invoices = invRes?.success ? invRes.data : [];
    const clients = clientsRes?.success ? clientsRes.data : [];

    useEffect(() => {
        const handleOpenModal = () => setShowCreateModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('open-create-invoice-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);
        return () => {
            window.removeEventListener('open-create-invoice-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    const handleCreateInvoice = async (data) => {
        try {
            await createInvoice(data).unwrap();
            setShowCreateModal(false);
        } catch (err) {
            alert(err.data?.message || err.message);
        }
    };

    const handleUpdatePayment = async (id, paymentData) => {
        try {
            await updatePayment({ id, ...paymentData }).unwrap();
        } catch (err) {
            alert(err.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await deleteInvoice(id).unwrap();
        } catch (err) {
            alert(err.data?.message || err.message);
        }
    };

    const filtered = invoices.filter(inv => {
        const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.invoiceDate || b.createdAt) - new Date(a.invoiceDate || a.createdAt));

    return {
        invoices, clients, loading, submitting, error, searchTerm, setSearchTerm,
        statusFilter, setStatusFilter, showFilterDropdown, setShowFilterDropdown,
        showCreateModal, setShowCreateModal, expandedRow, setExpandedRow,
        formData, setFormData, filtered, handleCreateInvoice, handleUpdatePayment, handleDelete
    };
};
