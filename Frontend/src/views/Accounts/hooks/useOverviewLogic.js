import { useState, useEffect } from 'react';
import { accountsAPI, staffAPI } from '../../../models/api';

export const useOverviewLogic = (globalFilter) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [pendingCollections, setPendingCollections] = useState([]);
    const [accountsStaff, setAccountsStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({});
    const [assigningStaff, setAssigningStaff] = useState({});
    const [verifyingPayment, setVerifyingPayment] = useState({});
    const [collectedAmounts, setCollectedAmounts] = useState({});

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const params = { startDate: globalFilter.start, endDate: globalFilter.end };
                const res = await accountsAPI.getStats(params);
                if (isMounted && res?.success) setStats(res.data);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchDashboardData();

        accountsAPI.getPendingCollections().then(res => {
            if (res?.success) {
                const pending = (res.data || []).filter(p => p.stage === 'Pending Payment');
                setPendingCollections(pending);
            }
        }).catch(() => {});

        staffAPI?.getAll?.({ role: 'Accounts Staff', status: 'Active' }).then(res => {
            setAccountsStaff(res?.data || []);
        }).catch(() => {});

        return () => { isMounted = false; };
    }, [globalFilter]);

    const handleAssignStaff = async (projectId) => {
        const staffId = selectedStaff[projectId];
        if (!staffId) return;
        try {
            setAssigningStaff(prev => ({ ...prev, [projectId]: true }));
            const res = await accountsAPI.assignStaff({ projectId, staffId });
            if (res?.success) {
                setPendingCollections(prev => prev.map(p => p._id === projectId
                    ? { ...p, paymentCollectionStatus: 'Assigned', assignedAccountsStaff: accountsStaff.find(s => s._id === staffId) }
                    : p
                ));
            }
        } catch (e) { console.error(e); }
        finally { setAssigningStaff(prev => ({ ...prev, [projectId]: false })); }
    };

    const handleVerifyPayment = async (projectId) => {
        const amt = collectedAmounts[projectId];
        if (!amt) { alert('Please enter collected amount'); return; }
        try {
            setVerifyingPayment(prev => ({ ...prev, [projectId]: true }));
            const res = await accountsAPI.verifyPayment({ projectId, collectedAmount: amt });
            if (res?.success) {
                setPendingCollections(prev => prev.filter(p => p._id !== projectId));
                alert('Payment verified! Project released to Procurement.');
            }
        } catch (e) { console.error(e); }
        finally { setVerifyingPayment(prev => ({ ...prev, [projectId]: false })); }
    };

    return {
        loading, stats, pendingCollections, accountsStaff, selectedStaff, setSelectedStaff,
        assigningStaff, verifyingPayment, collectedAmounts, setCollectedAmounts,
        handleAssignStaff, handleVerifyPayment
    };
};
