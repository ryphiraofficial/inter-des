import { taskAPI, procurementAPI } from '../../../../models/api';
import { productionManagerAPI } from '../../../../models/api';

export const useApprovalsActions = ({ 
    setTasks, setProcurementItems, setProductionProjects, setSubmittingApproval, 
    setShowPaymentModal, setPaymentTask, setShowDesignModal, showToast, 
    selectedPM, sentToAccounts, setApproving, setApprovingProduction
}) => {

    const submitApproval = async ({ paymentTask, advancePct, paymentDueDate, paymentNotes, procurementManagerId }) => {
        if (!procurementManagerId) {
            showToast('Please assign a Procurement Manager', 'error');
            return;
        }
        if (!paymentDueDate) {
            showToast('Please set a payment due date', 'error');
            return;
        }
        try {
            setSubmittingApproval(true);
            const response = await taskAPI.adminReview(paymentTask._id, {
                approved: true,
                advancePercentage: advancePct,
                paymentDueDate,
                adminPaymentNotes: paymentNotes,
                procurementManagerId
            });
            if (response.success) {
                setTasks(prev => prev.filter(t => t._id !== paymentTask._id));
                setShowPaymentModal(false);
                setPaymentTask(null);
                const quotTotal = paymentTask.quotation?.totalAmount || 0;
                const amt = Math.round((quotTotal * advancePct) / 100);
                showToast(`Design approved! Assigned to Procurement Manager and sent ₹${amt.toLocaleString('en-IN')} collection request to Accounts Manager.`);
            } else {
                showToast(response.message || 'Approval failed', 'error');
            }
        } catch (err) {
            showToast('Approval failed: ' + err.message, 'error');
        } finally {
            setSubmittingApproval(false);
        }
    };

    const handleReject = async (taskId) => {
        const note = window.prompt('Enter the reason for rejection (will be sent to the designer):');
        if (!note) return;
        try {
            const response = await taskAPI.adminReview(taskId, { approved: false, rejectionReason: note });
            if (response.success) {
                setTasks(prev => prev.filter(t => t._id !== taskId));
                setShowDesignModal(false);
                showToast('Design rejected and sent back for revisions');
            }
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
            await procurementAPI.adminApproveProcurement(item._id, {
                productionManagerId: pmId,
                sendToAccounts: false,
                itemType: item.type || 'MaterialRequest'
            });
            setProcurementItems(prev => prev.filter(t => t._id !== item._id));
            showToast('Procurement approved — PM assigned');
        } catch (err) {
            console.error(err);
            showToast('Action failed', 'error');
        } finally {
            setApproving(prev => ({ ...prev, [item._id]: false }));
        }
    };

    const handleProductionApprove = async (projectId, remarks) => {
        try {
            setApprovingProduction(prev => ({ ...prev, [projectId]: true }));
            const res = await productionManagerAPI.adminApproveProductionProject(projectId, { action: 'approve', remarks });
            if (res.success) {
                setProductionProjects(prev => prev.filter(p => p._id !== projectId));
                showToast('Production project approved successfully!');
            } else {
                showToast(res.message || 'Approval failed', 'error');
            }
        } catch (err) {
            showToast('Approval failed: ' + err.message, 'error');
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
            const res = await productionManagerAPI.adminApproveProductionProject(projectId, { action: 'reject', remarks });
            if (res.success) {
                setProductionProjects(prev => prev.filter(p => p._id !== projectId));
                showToast('Project sent back to Project Manager for rework.');
            } else {
                showToast(res.message || 'Rejection failed', 'error');
            }
        } catch (err) {
            showToast('Rejection failed: ' + err.message, 'error');
        } finally {
            setApprovingProduction(prev => ({ ...prev, [projectId]: false }));
        }
    };

    return { submitApproval, handleReject, handleProcurementApprove, handleProductionApprove, handleProductionReject };
};
