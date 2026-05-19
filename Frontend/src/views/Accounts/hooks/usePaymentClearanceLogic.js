import { useState, useEffect } from 'react';
import { accountsAPI, staffAPI } from '../../../models/api';

export const usePaymentClearanceLogic = (parentSearch, parentSetSearch) => {
    const [projects, setProjects] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [assigningId, setAssigningId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, staffRes] = await Promise.all([
                accountsAPI.getPendingAccountsProjects().catch(() => ({ success: false })),
                staffAPI.getAll().catch(() => ({ success: false }))
            ]);
            
            if (projRes?.success) setProjects(projRes.data || []);
            if (staffRes?.success) {
                const accStaff = (staffRes.data || []).filter(s => s.role === 'Accounts Staff' || s.department === 'Accounts');
                setStaffList(accStaff);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (projectId) => {
        if (!selectedStaff) return alert('Please select a staff member');
        try {
            await accountsAPI.assignAccountsStaff({ projectId, staffId: selectedStaff });
            setAssigningId(null);
            setSelectedStaff('');
            fetchData();
        } catch (err) {
            alert('Error assigning staff: ' + err.message);
        }
    };

    const handleClear = async (projectId, isVerification = false) => {
        if (isVerification) {
            const project = projects.find(p => p._id === projectId);
            const collectedAmt = project?.collectedAmount || project?.advanceAmount || 0;
            if (!window.confirm(`Verify and approve payment of ₹${collectedAmt.toLocaleString('en-IN')} and release project to Procurement?`)) return;
            try {
                await accountsAPI.verifyPaymentAndRelease({ 
                    projectId, 
                    collectedAmount: collectedAmt,
                    paymentNotes: 'Verified and approved by Accounts Manager.' 
                });
                fetchData();
            } catch (err) {
                alert('Error verifying payment: ' + err.message);
            }
        } else {
            if (!window.confirm('Clear payment and release this project to Design?')) return;
            try {
                await accountsAPI.clearProjectPayment({ projectId });
                fetchData();
            } catch (err) {
                alert('Error clearing project: ' + err.message);
            }
        }
    };

    const filtered = projects.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.client?.name?.toLowerCase().includes(search.toLowerCase()));

    return {
        projects, staffList, loading, search, setSearch, assigningId, setAssigningId,
        selectedStaff, setSelectedStaff, filtered, handleAssign, handleClear
    };
};
