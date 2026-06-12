import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetSalesClientsQuery, useCreateSalesClientMutation } from '../../../store/api/salesApi';

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
    dateOfBirth: '',
    status: 'Active'
};

export const useSalesClients = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [formData, setFormData] = useState(initialFormData);
    
    const searchTerm = searchParams.get('q') || '';
    const showModal = searchParams.get('action') === 'new';

    const { data: clientsRes, isLoading: loading } = useGetSalesClientsQuery();
    const [createClient, { isLoading: submitting }] = useCreateSalesClientMutation();
    
    const clients = clientsRes?.success ? clientsRes.data : [];

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
        try {
            await createClient(formData).unwrap();
            alert('Client added successfully');
            closeModal();
            setFormData(initialFormData);
        } catch (err) {
            alert(err.data?.message || err.message || 'Failed to add client');
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
