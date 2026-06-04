import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuotationListState } from './quotations/list/hooks/useQuotationListState';
import { useQuotationListData } from './quotations/list/hooks/useQuotationListData';
import { useQuotationListActions } from './quotations/list/hooks/useQuotationListActions';
import { getRolePermissions } from './hooks/useRoleDashboard';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

import QuotationTabs from './quotations/list/components/QuotationTabs';
import QuotationTable from './quotations/list/components/QuotationTable';
import ApproveQuotationModal from './quotations/list/components/ApproveQuotationModal';
import { TableSkeleton } from './components/Skeleton';

import './css/Quotations.css';

const Quotations = ({ isStaff }) => {
    const user = useAppSelector(selectUser);
    const state = useQuotationListState();
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    
    const { fetchQuotations } = useQuotationListData({
        setQuotations: state.setQuotations,
        setLoading: state.setLoading,
        setError: state.setError,
        setSearchTerm: state.setSearchTerm,
        setDesignManagers: state.setDesignManagers
    });

    const actions = useQuotationListActions({
        fetchQuotations,
        setSubmitting: state.setSubmitting,
        setExpandedRow: state.setExpandedRow,
        expandedRow: state.expandedRow
    });

    const triggerApprovalModal = (quotation) => {
        setSelectedQuotation(quotation);
        setIsApproveModalOpen(true);
    };

    const handleConfirmApproval = async (id, designManagerId) => {
        setIsApproveModalOpen(false);
        await actions.handleApprove(id, designManagerId);
    };

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
                    <TableSkeleton rows={10} cols={6} />
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
                        handleApprove={triggerApprovalModal}
                        handleDelete={actions.handleDelete}
                        isStaff={isStaff}
                        canApprove={canApprove}
                        submitting={state.submitting}
                    />
                )}
            </div>

            <ApproveQuotationModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleConfirmApproval}
                quotation={selectedQuotation}
                designManagers={state.designManagers}
                submitting={state.submitting}
            />
        </div>
    );
};

export default Quotations;
