import React from 'react';
import { usePOState } from './purchase-orders/hooks/usePOState';
import { usePOData } from './purchase-orders/hooks/usePOData';
import { usePOActions } from './purchase-orders/hooks/usePOActions';

import POStats from './purchase-orders/components/POStats';
import POFilterBar from './purchase-orders/components/POFilterBar';
import POTable from './purchase-orders/components/POTable';
import POFormModal from './purchase-orders/components/POFormModal';

import './css/PurchaseOrders.css';

const PurchaseOrders = () => {
    const state = usePOState();
    
    const { fetchPurchaseOrders } = usePOData({
        setPurchaseOrders: state.setPurchaseOrders,
        setLoading: state.setLoading,
        setError: state.setError,
        setShowCreateModal: state.setShowCreateModal
    });

    const actions = usePOActions({
        fetchPurchaseOrders,
        setSubmitting: state.setSubmitting,
        setShowCreateModal: state.setShowCreateModal,
        setFormData: state.setFormData,
        setPurchaseOrders: state.setPurchaseOrders,
        purchaseOrders: state.purchaseOrders
    });

    const filteredPOs = state.purchaseOrders.filter(po => {
        const matchesSearch = po.poNumber?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            po.supplier?.toLowerCase().includes(state.searchTerm.toLowerCase());
        const matchesStatus = state.statusFilter === 'All Status' || po.status === state.statusFilter;
        return matchesSearch && matchesStatus;
    });

    const toggleRow = (id) => {
        state.setExpandedRow(state.expandedRow === id ? null : id);
    };

    return (
        <div className="po-container">
            <div className="po-wrapper">
                <POStats purchaseOrders={state.purchaseOrders} />

                <POFilterBar 
                    searchTerm={state.searchTerm}
                    setSearchTerm={state.setSearchTerm}
                    statusFilter={state.statusFilter}
                    setStatusFilter={state.setStatusFilter}
                />

                {state.error && <div className="error-banner">{state.error}</div>}

                <div className="po-table-card">
                    <POTable 
                        purchaseOrders={filteredPOs}
                        loading={state.loading}
                        expandedRow={state.expandedRow}
                        toggleRow={toggleRow}
                        handleMarkReceived={actions.handleMarkReceived}
                        handleDelete={actions.handleDelete}
                    />
                </div>
            </div>

            <POFormModal 
                showCreateModal={state.showCreateModal}
                setShowCreateModal={state.setShowCreateModal}
                formData={state.formData}
                setFormData={state.setFormData}
                submitting={state.submitting}
                handleCreatePO={actions.handleCreatePO}
            />
        </div>
    );
};

export default PurchaseOrders;
