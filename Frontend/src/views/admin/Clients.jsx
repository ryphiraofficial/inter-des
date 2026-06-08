import React from 'react';
import { Users } from 'lucide-react';
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

    return (
        <div className={`clients-container ${isStaff ? 'staff-view' : ''}`}>
            <div className="clients-wrapper">
                <ClientHeader 
                    clients={state.clients}
                    activeTab={state.activeTab}
                    setActiveTab={state.setActiveTab}
                    sevenDaysAgo={SEVEN_DAYS_AGO}
                />

                {!state.loading && filteredClients.length === 0 ? (
                    <div className="c-empty-state-card">
                        <Users size={48} />
                        <h4>No clients found</h4>
                        <p>Try matching your search or filters to different criteria.</p>
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
