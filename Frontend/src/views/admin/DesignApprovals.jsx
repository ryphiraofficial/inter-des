import React from 'react';
import { Image as ImageIcon, Package, Wrench, LockOpen, CreditCard, Layers } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';

// Hooks
import { useApprovalsState } from './design-approvals/hooks/useApprovalsState';
import { useApprovalsData } from './design-approvals/hooks/useApprovalsData';
import { useApprovalsActions } from './design-approvals/hooks/useApprovalsActions';

// Components
import ApprovalTabs from './design-approvals/components/ApprovalTabs';
import DesignPipeline from './design-approvals/components/DesignPipeline';
import AccountsPipeline from './design-approvals/components/AccountsPipeline';
import ProcurementPipeline from './design-approvals/components/ProcurementPipeline';
import ProductionPipeline from './design-approvals/components/ProductionPipeline';
import DesignPreviewModal from './design-approvals/components/DesignPreviewModal';
import PaymentCollectionModal from './design-approvals/components/PaymentCollectionModal';
import ApprovalSkeleton from './design-approvals/components/ApprovalSkeleton';
import UnlockRequestsTable from '../production/project_manager/components/Approvals/UnlockRequestsTable';
import EdgeBandRequestsTab from '../design/manager/components/EdgeBandRequestsTab';
import { useGetUnlockRequestsQuery } from '../../store/api/productionApi';

import './css/Tasks.css';

const DesignApprovals = () => {
    const { showToast } = useToast();
    const state = useApprovalsState();

    // Fetch unlock requests for count
    const { data: unlockRes } = useGetUnlockRequestsQuery();
    const unlockCount = unlockRes?.data?.length || 0;

    useApprovalsData({
        setTasks: state.setTasks,
        setAccountsProjects: state.setAccountsProjects,
        setProcurementItems: state.setProcurementItems,
        setProductionProjects: state.setProductionProjects,
        setEdgeBandsCount: state.setEdgeBandsCount,
        setLoading: state.setLoading,
        setProductionManagers: state.setProductionManagers,
        setProcurementManagers: state.setProcurementManagers,
        setAccountsManagers: state.setAccountsManagers,
        showToast
    });

    const actions = useApprovalsActions({
        setTasks: state.setTasks,
        setAccountsProjects: state.setAccountsProjects,
        setProcurementItems: state.setProcurementItems,
        setProductionProjects: state.setProductionProjects,
        setSubmittingApproval: state.setSubmittingApproval,
        setShowPaymentModal: state.setShowPaymentModal,
        setPaymentTask: state.setPaymentTask,
        setShowDesignModal: state.setShowDesignModal,
        showToast,
        selectedPM: state.selectedPM,
        sentToAccounts: state.sentToAccounts,
        setApproving: state.setApproving,
        setApprovingProduction: state.setApprovingProduction
    });

    const openApproveModal = (task) => {
        state.setPaymentTask(task);
        state.setAdvancePct(30);
        state.setPaymentDueDate('');
        state.setPaymentNotes('');
        state.setShowPaymentModal(true);
        state.setShowDesignModal(false);
    };

    if (state.loading) return <ApprovalSkeleton />;

    return (
        <div className="tasks-container">
            <div className="tasks-wrapper" style={{ maxWidth: '1600px' }}>

                <ApprovalTabs
                    activeTab={state.activeTab}
                    setActiveTab={state.setActiveTab}
                    counts={{
                        design: state.tasks.length,
                        accounts: state.accountsProjects.length,
                        procurement: state.procurementItems.length,
                        production: state.productionProjects.length,
                        edge_bands: state.edgeBandsCount,
                        unlocks: unlockCount
                    }}
                />

                {state.activeTab === 'design' && (
                    <DesignPipeline
                        tasks={state.tasks}
                        setSelectedTask={state.setSelectedTask}
                        setShowDesignModal={state.setShowDesignModal}
                        openApproveModal={openApproveModal}
                    />
                )}

                {state.activeTab === 'accounts' && (
                    <AccountsPipeline
                        projects={state.accountsProjects}
                        procurementManagers={state.procurementManagers}
                        handleClearPayment={actions.handleClearPayment}
                        approving={state.approving}
                    />
                )}

                {state.activeTab === 'procurement' && (
                    <ProcurementPipeline
                        procurementItems={state.procurementItems}
                        selectedPM={state.selectedPM}
                        setSelectedPM={state.setSelectedPM}
                        sentToAccounts={state.sentToAccounts}
                        setSentToAccounts={state.setSentToAccounts}
                        productionManagers={state.productionManagers}
                        handleProcurementApprove={actions.handleProcurementApprove}
                        approving={state.approving}
                    />
                )}

                {state.activeTab === 'production' && (
                    <ProductionPipeline
                        productionProjects={state.productionProjects}
                        onApprove={actions.handleProductionApprove}
                        onReject={actions.handleProductionReject}
                        approving={state.approvingProduction}
                    />
                )}

                {state.activeTab === 'edge_bands' && (
                    <EdgeBandRequestsTab userRole="admin" />
                )}

                {state.activeTab === 'unlocks' && (
                    <UnlockRequestsTable />
                )}
            </div>

            {state.showDesignModal && state.selectedTask && (
                <DesignPreviewModal
                    selectedTask={state.selectedTask}
                    setShowDesignModal={state.setShowDesignModal}
                    handleReject={actions.handleReject}
                    openApproveModal={openApproveModal}
                />
            )}

            {state.showPaymentModal && state.paymentTask && (
                <PaymentCollectionModal
                    paymentTask={state.paymentTask}
                    setShowPaymentModal={state.setShowPaymentModal}
                    advancePct={state.advancePct}
                    setAdvancePct={state.setAdvancePct}
                    paymentDueDate={state.paymentDueDate}
                    setPaymentDueDate={state.setPaymentDueDate}
                    paymentNotes={state.paymentNotes}
                    setPaymentNotes={state.setPaymentNotes}
                    accountsManagers={state.accountsManagers}
                    selectedAccountsManagerId={state.selectedAccountsManagerId}
                    setSelectedAccountsManagerId={state.setSelectedAccountsManagerId}
                    submitApproval={actions.submitApproval}
                    submittingApproval={state.submittingApproval}
                />
            )}

            <style>{`
                .approval-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    border-color: #6366f1;
                }
                .modal-content-wide {
                    width: 100% !important;
                    max-width: 1000px !important;
                    margin: 1.5rem !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
                }
                @media (max-width: 600px) {
                    .approval-tabs-container {
                        overflow-x: auto !important;
                        white-space: nowrap !important;
                        display: flex !important;
                        gap: 0.5rem !important;
                        padding-bottom: 2px;
                        border-bottom: 2px solid #e2e8f0;
                    }
                    .approval-tabs-container::-webkit-scrollbar { display: none; }
                    .approval-tabs-container button {
                        flex-shrink: 0 !important;
                        padding: 10px 14px !important;
                        font-size: 0.85rem !important;
                    }
                }
                @media (max-width: 480px) {
                    .approval-card-actions { flex-direction: column !important; gap: 8px !important; }
                    .approval-card-actions button { width: 100% !important; }
                }
            `}</style>
        </div>
    );
};

export default DesignApprovals;
