import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuotationListState } from './quotations/list/hooks/useQuotationListState';
import { useQuotationListData } from './quotations/list/hooks/useQuotationListData';
import { useQuotationListActions } from './quotations/list/hooks/useQuotationListActions';
import { getRolePermissions } from './hooks/useRoleDashboard';

import QuotationTabs from './quotations/list/components/QuotationTabs';
import QuotationTable from './quotations/list/components/QuotationTable';

import './css/Quotations.css';

const Quotations = ({ isStaff, user }) => {
    const state = useQuotationListState();
    
    const { fetchQuotations } = useQuotationListData({
        setQuotations: state.setQuotations,
        setLoading: state.setLoading,
        setError: state.setError,
        setSearchTerm: state.setSearchTerm
    });

    const actions = useQuotationListActions({
        fetchQuotations,
        setSubmitting: state.setSubmitting,
        setExpandedRow: state.setExpandedRow,
        expandedRow: state.expandedRow
    });

    const canApprove = getRolePermissions(user?.role).canApproveQuotations;

    const filteredQuotations = state.quotations.filter(q => {
        const matchesSearch = (
            q.quotationNumber?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            q.projectName?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            q.client?.name?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );

        const matchesTab = (
            state.activeTab === 'All' ||
            (state.activeTab === 'Under Review' && q.status === 'Under Review') ||
            (state.activeTab === 'Approved' && q.status === 'Approved')
        );

        return matchesSearch && matchesTab;
    });

    return (
        <div className={`quotations-wrapper ${isStaff ? 'staff-view' : ''}`}>
            <div className="quotations-content">
                <QuotationTabs 
                    quotations={state.quotations}
                    activeTab={state.activeTab}
                    setActiveTab={state.setActiveTab}
                />



                {state.loading ? (
                    <div className="skeleton-table">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton-table-row">
                                <div className="skeleton skeleton-table-cell" style={{ flex: 2 }} /><div className="skeleton skeleton-table-cell" /><div className="skeleton skeleton-table-cell" />
                            </div>
                        ))}
                    </div>
                ) : filteredQuotations.length === 0 ? (
                    <div className="q-empty-state-card">
                        <FileText size={48} />
                        <h4>No quotations found</h4>
                        <p>Try matching your search or filters to different criteria.</p>
                    </div>
                ) : (
                    <QuotationTable 
                        quotations={filteredQuotations}
                        expandedRow={state.expandedRow}
                        toggleRow={actions.toggleRow}
                        handleApprove={actions.handleApprove}
                        handleDelete={actions.handleDelete}
                        isStaff={isStaff}
                        canApprove={canApprove}
                        submitting={state.submitting}
                    />
                )}
            </div>
        </div>
    );
};

export default Quotations;
