import { useState, useEffect } from 'react';
import { invoiceAPI, clientAPI } from '../../../models/api';

export const useInvoiceLogic = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
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

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoiceAPI.getAll();
            if (response.success) setInvoices(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await clientAPI.getAll();
            if (response.success) setClients(response.data);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    useEffect(() => {
        fetchInvoices();
        fetchClients();
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
            setSubmitting(true);
            const response = await invoiceAPI.create(data);
            if (response.success) {
                setShowCreateModal(false);
                fetchInvoices();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePayment = async (id, paymentData) => {
        try {
            const response = await invoiceAPI.updatePayment(id, paymentData);
            if (response.success) {
                setInvoices(prev => prev.map(inv => inv._id === id ? { ...inv, ...response.data } : inv));
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            const response = await invoiceAPI.delete(id);
            if (response.success) setInvoices(prev => prev.filter(inv => inv._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const filtered = invoices.filter(inv => {
        const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return {
        invoices, clients, loading, submitting, error, searchTerm, setSearchTerm,
        statusFilter, setStatusFilter, showFilterDropdown, setShowFilterDropdown,
        showCreateModal, setShowCreateModal, expandedRow, setExpandedRow,
        formData, setFormData, filtered, handleCreateInvoice, handleUpdatePayment, handleDelete
    };
};
