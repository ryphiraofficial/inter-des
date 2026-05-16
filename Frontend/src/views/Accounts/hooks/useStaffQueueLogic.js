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
                const myProjects = (res.data || []).filter(p => p.assignedAccountsStaff?._id === user._id || p.assignedAccountsStaff === user._id);
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
