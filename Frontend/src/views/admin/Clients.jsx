import React from 'react';
import { Users, Plus } from 'lucide-react';
import { useClientState } from './clients/hooks/useClientState';
import { useClientData } from './clients/hooks/useClientData';
import { useClientActions } from './clients/hooks/useClientActions';

import ClientHeader from './clients/components/ClientHeader';
import ClientTable from './clients/components/ClientTable';
import ClientFormModal from './clients/components/ClientFormModal';
import DeleteConfirmModal from './clients/components/DeleteConfirmModal';

import './css/Clients.css';

const Clients = ({ isStaff }) => {
    const state = useClientState();
    
    const { fetchClients } = useClientData({
        setClients: state.setClients,
        setLoading: state.setLoading,
        setError: state.setError,
        setShowNewClientModal: state.setShowNewClientModal,
        setSearchTerm: state.setSearchTerm
    });

    const actions = useClientActions({
        fetchClients,
        setSubmitting: state.setSubmitting,
        setShowNewClientModal: state.setShowNewClientModal,
        setEditingClient: state.setEditingClient,
        setFormData: state.setFormData,
        initialFormData: state.initialFormData,
        clientToDelete: state.clientToDelete,
        setClientToDelete: state.setClientToDelete,
        setIsDeleting: state.setIsDeleting
    });

    const SEVEN_DAYS_AGO = new Date();
    SEVEN_DAYS_AGO.setDate(SEVEN_DAYS_AGO.getDate() - 7);

    const filteredClients = state.clients.filter(client => {
        const matchesSearch = (
            client.name?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            client.phone?.includes(state.searchTerm)
        );

        const matchesTab = (
            state.activeTab === 'All' ||
            (state.activeTab === 'New' && new Date(client.createdAt) >= SEVEN_DAYS_AGO) ||
            (state.activeTab === 'Staff Added' && client.createdBy?.role === 'Staff')
        );

        return matchesSearch && matchesTab;
    });

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    const handleOpenNewClientModal = () => {
        state.setEditingClient(null);
        state.setFormData(state.initialFormData);
        state.setShowNewClientModal(true);
    };

    return (
        <div className={`clients-container ${isStaff ? 'staff-view' : ''}`} style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            <div className="clients-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <ClientHeader 
                    clients={state.clients}
                    activeTab={state.activeTab}
                    setActiveTab={state.setActiveTab}
                    sevenDaysAgo={SEVEN_DAYS_AGO}
                    onAddClient={handleOpenNewClientModal}
                />

                {!state.loading && filteredClients.length === 0 ? (
                    <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <Users size={28} />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>No Clients Found</h4>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                            {state.searchTerm ? 'No clients match your search criteria.' : 'Add your first client account to manage projects, invoices, and quotations.'}
                        </p>
                        <button
                            type="button"
                            onClick={handleOpenNewClientModal}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '9px 18px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#2563eb',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.84rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            <Plus size={16} /> Add Client
                        </button>
                    </div>
                ) : (
                    <ClientTable 
                        clients={filteredClients}
                        loading={state.loading}
                        isStaff={isStaff}
                        expandedRow={state.expandedRow}
                        toggleRow={toggleRow}
                        handleEdit={actions.handleEdit}
                        handleDelete={actions.handleDelete}
                    />
                )}
            </div>

            <ClientFormModal 
                showNewClientModal={state.showNewClientModal}
                editingClient={state.editingClient}
                formData={state.formData}
                setFormData={state.setFormData}
                submitting={state.submitting}
                handleSubmit={actions.handleSubmit}
                closeModal={actions.closeModal}
            />

            <DeleteConfirmModal
                isOpen={!!state.clientToDelete}
                onClose={() => state.setClientToDelete(null)}
                onConfirm={actions.confirmDelete}
                itemName="client"
                isDeleting={state.isDeleting}
            />
        </div>
    );
};

export default Clients;
