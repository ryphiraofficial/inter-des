import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clientAPI } from '../../../models/api';

const initialFormData = {
    name: '',
    projectName: '',
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

export const useSalesClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [formData, setFormData] = useState(initialFormData);
    
    const searchTerm = searchParams.get('q') || '';
    const showModal = searchParams.get('action') === 'new';

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await clientAPI.getAll();
            if (response.success) {
                setClients(response.data);
            }
        } catch (err) {
            console.error('Failed to load clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        const p = new URLSearchParams(searchParams);
        p.delete('action');
        setSearchParams(p);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await clientAPI.create(formData);
            if (response.success) {
                alert('Client added successfully');
                closeModal();
                setFormData(initialFormData);
                fetchClients();
            }
        } catch (err) {
            alert(err.message || 'Failed to add client');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.siteAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        loading,
        submitting,
        showModal,
        formData,
        filteredClients,
        closeModal,
        handleInputChange,
        handleSubmit
    };
};
