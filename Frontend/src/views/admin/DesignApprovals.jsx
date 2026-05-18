import React from 'react';
import { Clock } from 'lucide-react';
import { useToast } from '../../models/context/ToastContext';

// Hooks
import { useApprovalsState } from './design-approvals/hooks/useApprovalsState';
import { useApprovalsData } from './design-approvals/hooks/useApprovalsData';
import { useApprovalsActions } from './design-approvals/hooks/useApprovalsActions';

// Components
import ApprovalTabs from './design-approvals/components/ApprovalTabs';
import DesignPipeline from './design-approvals/components/DesignPipeline';
import ProcurementPipeline from './design-approvals/components/ProcurementPipeline';
import DesignPreviewModal from './design-approvals/components/DesignPreviewModal';
import PaymentCollectionModal from './design-approvals/components/PaymentCollectionModal';
import ApprovalSkeleton from './design-approvals/components/ApprovalSkeleton';

import './css/Tasks.css';

const DesignApprovals = () => {
    const { showToast } = useToast();
    const state = useApprovalsState();
    
    useApprovalsData({
        setTasks: state.setTasks,
        setProcurementItems: state.setProcurementItems,
        setLoading: state.setLoading,
        setProductionManagers: state.setProductionManagers,
        setProcurementManagers: state.setProcurementManagers,
        showToast
    });

    const actions = useApprovalsActions({
        setTasks: state.setTasks,
        setProcurementItems: state.setProcurementItems,
        setSubmittingApproval: state.setSubmittingApproval,
        setShowPaymentModal: state.setShowPaymentModal,
        setPaymentTask: state.setPaymentTask,
        setShowDesignModal: state.setShowDesignModal,
        showToast,
        selectedPM: state.selectedPM,
        sentToAccounts: state.sentToAccounts,
        setApproving: state.setApproving
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
                <div className="t-tasks-header" style={{ marginBottom: '2.5rem' }}>
                    <div className="queue-strength-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '12px 20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Queue Strength</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5' }}>{state.tasks.length + state.procurementItems.length} Pending</span>
                        </div>
                        <div style={{ width: '40px', height: '40px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                </div>

                <ApprovalTabs 
                    activeTab={state.activeTab} 
                    setActiveTab={state.setActiveTab} 
                    counts={{ design: state.tasks.length, procurement: state.procurementItems.length }} 
                />

                {state.activeTab === 'design' ? (
                    <DesignPipeline 
                        tasks={state.tasks} 
                        setSelectedTask={state.setSelectedTask} 
                        setShowDesignModal={state.setShowDesignModal} 
                        openApproveModal={openApproveModal} 
                    />
                ) : (
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
                    procurementManagers={state.procurementManagers}
                    selectedProcurementManagerId={state.selectedProcurementManagerId}
                    setSelectedProcurementManagerId={state.setSelectedProcurementManagerId}
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
                @media (max-width: 992px) {
                    .preview-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                }
                @media (max-width: 768px) {
                    .t-tasks-header { flex-direction: column !important; align-items: stretch !important; gap: 1rem; }
                    .queue-strength-box { justify-content: space-between; }
                    .modal-footer { flex-direction: column; padding: 1.5rem !important; }
                    .modal-footer button { width: 100%; }
                    .payment-info-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default DesignApprovals;
