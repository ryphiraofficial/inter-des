import { useState } from 'react';

export const useInvoiceState = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const [formData, setFormData] = useState({
        client: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: 'Design Consultation', quantity: 1, rate: 5000, tax: 18 }]
    });

    return {
        invoices, setInvoices,
        clients, setClients,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        showFilterDropdown, setShowFilterDropdown,
        showCreateModal, setShowCreateModal,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        formData, setFormData
    };
};
