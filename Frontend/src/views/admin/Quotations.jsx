import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuotationListState } from './quotations/list/hooks/useQuotationListState';
import { useQuotationListData } from './quotations/list/hooks/useQuotationListData';
import { useQuotationListActions } from './quotations/list/hooks/useQuotationListActions';
import { getRolePermissions } from './hooks/useRoleDashboard';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

import { useGetSettingsQuery } from '../../store/api/adminApi';
import { downloadQuotationPDF } from '../../utils/quotationPdfDownload';
import QuotationTabs from './quotations/list/components/QuotationTabs';
import QuotationTable from './quotations/list/components/QuotationTable';
import ApproveQuotationModal from './quotations/list/components/ApproveQuotationModal';
import AlertDialog from './components/AlertDialog';
import { TableSkeleton } from './components/Skeleton';

import './css/Quotations.css';

const Quotations = ({ isStaff }) => {
    const user = useAppSelector(selectUser);
    const state = useQuotationListState();
    const { data: settingsRes } = useGetSettingsQuery();
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [quotationToDelete, setQuotationToDelete] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    
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

    const handleDownloadQuotation = async (quotation) => {
        try {
            setDownloadingId(quotation._id);
            await downloadQuotationPDF(quotation, settingsRes?.data);
        } catch (err) {
            console.error('Download quotation PDF error:', err);
        } finally {
            setDownloadingId(null);
        }
    };

    const triggerApprovalModal = (quotation) => {
        setSelectedQuotation(quotation);
        setIsApproveModalOpen(true);
    };

    const handleConfirmApproval = async (id, designManagerId) => {
        setIsApproveModalOpen(false);
        await actions.handleApprove(id, designManagerId);
    };

    const triggerDeleteModal = (id) => {
        setQuotationToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!quotationToDelete) return;
        setIsDeleteModalOpen(false);
        await actions.handleDelete(quotationToDelete);
        setQuotationToDelete(null);
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

    const createUrl = isStaff ? '/staff/quotations/new' : '/quotations/new';

    return (
        <div className={`quotations-wrapper ${isStaff ? 'staff-view' : ''}`} style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
            <div className="quotations-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <QuotationTabs 
                    quotations={state.quotations}
                    activeTab={state.activeTab}
                    setActiveTab={state.setActiveTab}
                    isStaff={isStaff}
                />

                {state.loading ? (
                    <TableSkeleton rows={10} cols={6} />
                ) : filteredQuotations.length === 0 ? (
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
                            <FileText size={28} />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>No Quotations Found</h4>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                            {state.searchTerm ? 'No quotations match your search criteria.' : 'Create a new client quotation draft to begin tracking project estimates.'}
                        </p>
                        <Link
                            to={createUrl}
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
                                textDecoration: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            <Plus size={16} /> Create Quotation
                        </Link>
                    </div>
                ) : (
                    <QuotationTable 
                        quotations={filteredQuotations}
                        expandedRow={state.expandedRow}
                        toggleRow={actions.toggleRow}
                        handleApprove={triggerApprovalModal}
                        handleDelete={triggerDeleteModal}
                        handleDownload={handleDownloadQuotation}
                        downloadingId={downloadingId}
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

            <AlertDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Quotation"
                description="Are you sure you want to delete this quotation? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
                isProcessing={state.submitting}
            />
        </div>
    );
};

export default Quotations;
