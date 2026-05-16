import React from 'react';
import { useInvoiceState } from './invoice/hooks/useInvoiceState';
import { useInvoiceData } from './invoice/hooks/useInvoiceData';
import { useInvoiceActions } from './invoice/hooks/useInvoiceActions';

import InvoiceStats from './invoice/components/InvoiceStats';
import InvoiceFilterBar from './invoice/components/InvoiceFilterBar';
import InvoiceTable from './invoice/components/InvoiceTable';
import InvoiceFormModal from './invoice/components/InvoiceFormModal';
import { TableSkeleton, StatsSkeleton } from './components/Skeleton';

import './css/Invoice.css';

const Invoice = () => {
    const state = useInvoiceState();
    
    const { fetchInvoices } = useInvoiceData({
        setInvoices: state.setInvoices,
        setClients: state.setClients,
        setLoading: state.setLoading,
        setError: state.setError,
        setSearchTerm: state.setSearchTerm,
        setShowCreateModal: state.setShowCreateModal
    });

    const actions = useInvoiceActions({
        fetchInvoices,
        setSubmitting: state.setSubmitting,
        setShowCreateModal: state.setShowCreateModal,
        setFormData: state.setFormData,
        setInvoices: state.setInvoices,
        invoices: state.invoices
    });

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    const filteredInvoices = state.invoices.filter(inv => {
        const matchesSearch = inv.invoiceNumber?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            inv.client?.name?.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesStatus = state.statusFilter === 'All' || inv.status === state.statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="invoice-container">
            <div className="invoice-wrapper">
                {state.loading ? (
                    <StatsSkeleton count={4} />
                ) : (
                    <InvoiceStats invoices={state.invoices} />
                )}

                <InvoiceFilterBar 
                    statusFilter={state.statusFilter}
                    setStatusFilter={state.setStatusFilter}
                    showFilterDropdown={state.showFilterDropdown}
                    setShowFilterDropdown={state.setShowFilterDropdown}
                />

                {state.error && <div className="error-banner">{state.error}</div>}

                <div className="invoice-table-card">
                    <InvoiceTable 
                        invoices={filteredInvoices}
                        loading={state.loading}
                        expandedRow={state.expandedRow}
                        toggleRow={toggleRow}
                        handleUpdatePayment={actions.handleUpdatePayment}
                        handleDelete={actions.handleDelete}
                    />
                </div>
            </div>

            <InvoiceFormModal 
                showCreateModal={state.showCreateModal}
                setShowCreateModal={state.setShowCreateModal}
                formData={state.formData}
                setFormData={state.setFormData}
                clients={state.clients}
                submitting={state.submitting}
                handleCreateInvoice={actions.handleCreateInvoice}
            />
        </div>
    );
};

export default Invoice;
