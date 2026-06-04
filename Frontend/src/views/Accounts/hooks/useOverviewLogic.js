import { useState, useEffect } from 'react';
import {
    useGetAccountsStatsQuery,
    useGetPendingCollectionsQuery,
    useGetAccountsStaffQuery,
    useAssignAccountsStaffMutation,
    useVerifyPaymentAndReleaseMutation
} from '../../../store/api/accountsApi';

export const useOverviewLogic = (globalFilter) => {
    const [selectedStaff, setSelectedStaff] = useState({});
    const [assigningStaff, setAssigningStaff] = useState({});
    const [verifyingPayment, setVerifyingPayment] = useState({});
    const [collectedAmounts, setCollectedAmounts] = useState({});

    const statsParams = { startDate: globalFilter.start, endDate: globalFilter.end };
    const { data: statsRes, isLoading: statsLoading } = useGetAccountsStatsQuery(statsParams);
    
    const { data: collectionsRes, isLoading: collectionsLoading } = useGetPendingCollectionsQuery();
    const { data: staffRes, isLoading: staffLoading } = useGetAccountsStaffQuery({ role: 'Accounts Staff', status: 'Active' });

    const [assignStaffMut] = useAssignAccountsStaffMutation();
    const [verifyPaymentMut] = useVerifyPaymentAndReleaseMutation();

    const loading = statsLoading || collectionsLoading || staffLoading;
    const stats = statsRes?.success ? statsRes.data : null;
    const accountsStaff = staffRes?.success ? staffRes.data : [];
    
    const allCollections = collectionsRes?.success ? collectionsRes.data : [];
    const pendingCollections = allCollections.filter(p => p.stage === 'Pending Payment');

    const handleAssignStaff = async (projectId) => {
        const staffId = selectedStaff[projectId];
        if (!staffId) return;
        try {
            setAssigningStaff(prev => ({ ...prev, [projectId]: true }));
            await assignStaffMut({ projectId, staffId }).unwrap();
        } catch (e) {
            console.error(e);
        } finally {
            setAssigningStaff(prev => ({ ...prev, [projectId]: false }));
        }
    };

    const handleVerifyPayment = async (projectId) => {
        const amt = collectedAmounts[projectId];
        if (!amt) { alert('Please enter collected amount'); return; }
        try {
            setVerifyingPayment(prev => ({ ...prev, [projectId]: true }));
            await verifyPaymentMut({ projectId, collectedAmount: amt }).unwrap();
            alert('Payment verified! Project released to Procurement.');
        } catch (e) {
            console.error(e);
        } finally {
            setVerifyingPayment(prev => ({ ...prev, [projectId]: false }));
        }
    };

    return {
        loading, stats, pendingCollections, accountsStaff, selectedStaff, setSelectedStaff,
        assigningStaff, verifyingPayment, collectedAmounts, setCollectedAmounts,
        handleAssignStaff, handleVerifyPayment
    };
};
