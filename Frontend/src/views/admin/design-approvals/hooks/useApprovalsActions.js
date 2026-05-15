import { taskAPI, procurementAPI } from '../../../../models/api';

export const useApprovalsActions = ({ 
    setTasks, setProcurementItems, setSubmittingApproval, setShowPaymentModal, 
    setPaymentTask, setShowDesignModal, showToast, selectedPM, sentToAccounts, setApproving 
}) => {

    const submitApproval = async ({ paymentTask, advancePct, paymentDueDate, paymentNotes }) => {
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
                adminPaymentNotes: paymentNotes
            });
            if (response.success) {
                setTasks(prev => prev.filter(t => t._id !== paymentTask._id));
                setShowPaymentModal(false);
                setPaymentTask(null);
                const quotTotal = paymentTask.quotation?.totalAmount || 0;
                const amt = Math.round((quotTotal * advancePct) / 100);
                showToast(`Design approved! ₹${amt.toLocaleString('en-IN')} collection request sent to Accounts Manager.`);
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
        const shouldSendToAccounts = sentToAccounts[item._id];

        if (!pmId) {
            showToast('Please assign a Project Manager first', 'error');
            return;
        }
        if (!shouldSendToAccounts) {
            const skip = window.confirm('You have not sent the quotation to Accounts. Approve anyway?');
            if (!skip) return;
        }

        try {
            setApproving(prev => ({ ...prev, [item._id]: true }));
            await procurementAPI.adminApproveProcurement(item._id, {
                productionManagerId: pmId,
                sendToAccounts: !!shouldSendToAccounts,
                itemType: item.type || 'MaterialRequest'
            });
            setProcurementItems(prev => prev.filter(t => t._id !== item._id));
            showToast('Procurement approved — PM assigned & quotation sent to accounts');
        } catch (err) {
            console.error(err);
            showToast('Action failed', 'error');
        } finally {
            setApproving(prev => ({ ...prev, [item._id]: false }));
        }
    };

    return { submitApproval, handleReject, handleProcurementApprove };
};
