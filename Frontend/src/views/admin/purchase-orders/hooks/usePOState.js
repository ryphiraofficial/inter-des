import { useState } from 'react';

export const usePOState = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const [formData, setFormData] = useState({
        supplier: '',
        supplierContact: '',
        supplierEmail: '',
        deliveryAddress: '',
        deliveryDate: '',
        paymentTerms: 'Net 30 days',
        taxRate: 18,
        notes: '',
        items: []
    });

    const [selectedPO, setSelectedPO] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    return {
        purchaseOrders, setPurchaseOrders,
        loading, setLoading,
        error, setError,
        searchTerm, setSearchTerm,
        statusFilter, setStatusFilter,
        showCreateModal, setShowCreateModal,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        selectedPO, setSelectedPO,
        showViewModal, setShowViewModal,
        formData, setFormData
    };
};
