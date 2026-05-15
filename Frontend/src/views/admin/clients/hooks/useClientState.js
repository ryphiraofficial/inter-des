import { useState } from 'react';

export const useClientState = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [showNewClientModal, setShowNewClientModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const initialFormData = {
        name: '',
        email: '',
        phone: '',
        address: '',
        siteAddress: '',
        billingAddress: '',
        billingPincode: '',
        contact1: '',
        contact2: '',
        status: 'Active'
    };

    const [formData, setFormData] = useState(initialFormData);

    return {
        clients, setClients,
        loading, setLoading,
        searchTerm, setSearchTerm,
        activeTab, setActiveTab,
        showNewClientModal, setShowNewClientModal,
        editingClient, setEditingClient,
        error, setError,
        submitting, setSubmitting,
        expandedRow, setExpandedRow,
        formData, setFormData,
        initialFormData
    };
};
