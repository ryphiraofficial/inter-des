import { useState } from 'react';
import {
    useGetPendingCollectionsQuery,
    useGenerateAdvanceInvoiceMutation
} from '../../../store/api/accountsApi';

export const useStaffQueueLogic = (user) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const { data: projRes, isLoading: loading, refetch } = useGetPendingCollectionsQuery();
    const [generateInvoice] = useGenerateAdvanceInvoiceMutation();

    const allProjects = projRes?.success ? projRes.data : [];
    
    const projects = allProjects.filter(p => {
        const assignedStaff = p.assignedAccountsStaff;
        if (!assignedStaff) return false;
        
        const assignedStaffId = assignedStaff._id || assignedStaff;
        const loggedInUserId = user?._id || user?.id;
        
        // 1. Match by user ID
        if (loggedInUserId && assignedStaffId === loggedInUserId) return true;
        
        // 2. Fallback to match by email
        const assignedEmail = assignedStaff.email;
        const loggedInEmail = user?.email;
        if (assignedEmail && loggedInEmail && assignedEmail.toLowerCase() === loggedInEmail.toLowerCase()) return true;
        
        // 3. Fallback to match by staffId
        const assignedStaffIdVal = assignedStaff.staffId;
        const loggedInStaffIdVal = user?.staffId;
        if (assignedStaffIdVal && loggedInStaffIdVal && assignedStaffIdVal === loggedInStaffIdVal) return true;

        return false;
    });

    const handleGenerateInvoice = async (projectId) => {
        try {
            await generateInvoice({ projectId }).unwrap();
            alert('Invoice Generated & Sent!');
        } catch (err) {
            alert('Error: ' + (err.data?.message || err.message));
        }
    };

    const handleRecordPayment = (project) => {
        setSelectedProject(project);
        setShowPaymentModal(true);
    };

    return { 
        projects, 
        loading, 
        handleGenerateInvoice, 
        handleRecordPayment,
        showPaymentModal,
        setShowPaymentModal,
        selectedProject,
        fetchData: refetch
    };
};
