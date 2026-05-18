import React from 'react';
import { useInvoiceLogic } from '../hooks/useInvoiceLogic';
import InvoiceStats from './components/invoices/InvoiceStats';
import InvoiceFilterBar from './components/invoices/InvoiceFilterBar';
import InvoiceTable from './components/invoices/InvoiceTable';
import InvoiceFormModal from './components/invoices/InvoiceFormModal';
import { StatsSkeleton } from '../components/UI/Skeleton';
import '../../admin/css/Invoice.css';

const AccountsInvoices = () => {
    const state = useInvoiceLogic();

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
                        invoices={state.filtered}
                        loading={state.loading}
                        expandedRow={state.expandedRow}
                        toggleRow={state.setExpandedRow}
                        handleUpdatePayment={state.handleUpdatePayment}
                        handleDelete={state.handleDelete}
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
                handleCreateInvoice={state.handleCreateInvoice}
            />
        </div>
    );
};

export default AccountsInvoices;
