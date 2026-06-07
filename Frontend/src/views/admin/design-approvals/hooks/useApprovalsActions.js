import { 
    useAdminReviewTaskMutation, 
    useApproveProductionMutation, 
    useAdminApproveProcurementMutation,
    useAdminClearPaymentToProcurementMutation
} from '../../../../store/api/adminApi';

export const useApprovalsActions = ({ 
    setTasks, setAccountsProjects, setProcurementItems, setProductionProjects, setSubmittingApproval, 
    setShowPaymentModal, setPaymentTask, setShowDesignModal, showToast, 
    selectedPM, sentToAccounts, setApproving, setApprovingProduction
}) => {

    const [adminReview] = useAdminReviewTaskMutation();
    const [approveProduction] = useApproveProductionMutation();
    const [adminApproveProcurement] = useAdminApproveProcurementMutation();
    const [adminClearPayment] = useAdminClearPaymentToProcurementMutation();

    const submitApproval = async ({ paymentTask, advancePct, paymentDueDate, paymentNotes, accountsManagerId }) => {
        if (!paymentDueDate) {
            showToast('Please set a payment due date', 'error');
            return;
        }
        try {
            setSubmittingApproval(true);
            await adminReview({
                id: paymentTask._id,
                approved: true,
                advancePercentage: advancePct,
                paymentDueDate,
                adminPaymentNotes: paymentNotes,
                accountsManagerId
            }).unwrap();
            
            setTasks(prev => prev.filter(t => t._id !== paymentTask._id));
            setShowPaymentModal(false);
            setPaymentTask(null);
            const quotTotal = paymentTask.quotation?.totalAmount || 0;
            const amt = Math.round((quotTotal * advancePct) / 100);
            showToast(`Design approved! Sent ₹${amt.toLocaleString('en-IN')} collection request to Accounts Manager.`);
        } catch (err) {
            showToast('Approval failed: ' + (err.data?.message || err.message), 'error');
        } finally {
            setSubmittingApproval(false);
        }
    };

    const handleClearPayment = async (project, procurementManagerId, forceOverride = false, overrideReason = '') => {
        if (!procurementManagerId) {
            showToast('Please assign a Procurement Manager', 'error');
            return;
        }
        try {
            setApproving(prev => ({ ...prev, [project._id]: true }));
            const res = await adminClearPayment({
                id: project._id,
                procurementManagerId,
                forceOverride,
                overrideReason
            }).unwrap();
            
            setAccountsProjects(prev => prev.filter(p => p._id !== project._id));
            
            // Add the new material request to the procurement pipeline
            if (res.materialRequest) {
                setProcurementItems(prev => [...prev, { ...res.materialRequest, type: 'MaterialRequest' }]);
            }
            
            showToast(`Payment cleared! Project sent to Procurement.`);
        } catch (err) {
            showToast('Failed to clear payment: ' + (err.data?.message || err.message), 'error');
        } finally {
            setApproving(prev => ({ ...prev, [project._id]: false }));
        }
    };

    const handleReject = async (taskId) => {
        const note = window.prompt('Enter the reason for rejection (will be sent to the designer):');
        if (!note) return;
        try {
            await adminReview({ id: taskId, approved: false, rejectionReason: note }).unwrap();
            setTasks(prev => prev.filter(t => t._id !== taskId));
            setShowDesignModal(false);
            showToast('Design rejected and sent back for revisions');
        } catch (err) {
            showToast('Rejection failed', 'error');
        }
    };

    const handleProcurementApprove = async (item) => {
        const pmId = selectedPM[item._id];
        if (!pmId) {
            showToast('Please assign a Project Manager first', 'error');
            return;
        }
        try {
            setApproving(prev => ({ ...prev, [item._id]: true }));
            await adminApproveProcurement({
                id: item._id,
                productionManagerId: pmId,
                sendToAccounts: false,
                itemType: item.type || 'MaterialRequest'
            }).unwrap();
            setProcurementItems(prev => prev.filter(t => t._id !== item._id));
            showToast('Procurement approved — PM assigned');
        } catch (err) {
            console.error(err);
            showToast(err.data?.message || err.message || 'Action failed', 'error');
        } finally {
            setApproving(prev => ({ ...prev, [item._id]: false }));
        }
    };

    const handleProductionApprove = async (projectId, remarks) => {
        try {
            setApprovingProduction(prev => ({ ...prev, [projectId]: true }));
            await approveProduction({ id: projectId, status: 'approve', adminRemarks: remarks }).unwrap();
            setProductionProjects(prev => prev.filter(p => p._id !== projectId));
            showToast('Production project approved successfully!');
        } catch (err) {
            showToast('Approval failed: ' + (err.data?.message || err.message), 'error');
        } finally {
            setApprovingProduction(prev => ({ ...prev, [projectId]: false }));
        }
    };

    const handleProductionReject = async (projectId, remarks) => {
        if (!remarks) {
            const note = window.prompt('Please enter a reason for rejection:');
            if (!note) return;
            remarks = note;
        }
        try {
            setApprovingProduction(prev => ({ ...prev, [projectId]: true }));
            await approveProduction({ id: projectId, status: 'reject', adminRemarks: remarks }).unwrap();
            setProductionProjects(prev => prev.filter(p => p._id !== projectId));
            showToast('Project sent back to Project Manager for rework.');
        } catch (err) {
            showToast('Rejection failed: ' + (err.data?.message || err.message), 'error');
        } finally {
            setApprovingProduction(prev => ({ ...prev, [projectId]: false }));
        }
    };

    return { submitApproval, handleReject, handleProcurementApprove, handleProductionApprove, handleProductionReject, handleClearPayment };
};
