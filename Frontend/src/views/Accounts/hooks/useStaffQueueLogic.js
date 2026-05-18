import { useState, useEffect } from 'react';
import { accountsAPI } from '../../../models/api';

export const useStaffQueueLogic = (user) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await accountsAPI.getPendingAccountsProjects();
            if (res?.success) {
                const myProjects = (res.data || []).filter(p => {
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
                setProjects(myProjects);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInvoice = async (projectId) => {
        try {
            await accountsAPI.generateAdvanceInvoice({ projectId });
            alert('Invoice Generated & Sent!');
            fetchData();
        } catch (err) {
            alert('Error: ' + err.message);
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
        fetchData
    };
};
