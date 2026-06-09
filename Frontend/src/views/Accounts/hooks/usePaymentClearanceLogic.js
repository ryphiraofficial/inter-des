import { useState } from 'react';
import {
    useGetPendingCollectionsQuery,
    useGetAccountsStaffQuery,
    useAssignAccountsStaffMutation,
    useVerifyPaymentAndReleaseMutation,
    useClearProjectPaymentMutation
} from '../../../store/api/accountsApi';

export const usePaymentClearanceLogic = (parentSearch, parentSetSearch) => {
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [assigningId, setAssigningId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState('');

    const { data: projRes, isLoading: projLoading } = useGetPendingCollectionsQuery();
    const { data: staffRes, isLoading: staffLoading } = useGetAccountsStaffQuery();

    const [assignStaff] = useAssignAccountsStaffMutation();
    const [verifyPayment] = useVerifyPaymentAndReleaseMutation();
    const [clearPayment] = useClearProjectPaymentMutation();

    const loading = projLoading || staffLoading;
    const projects = projRes?.success ? projRes.data : [];
    const staffList = staffRes?.success ? staffRes.data.filter(s => s.role === 'Accounts Staff' || s.department === 'Accounts') : [];

    const handleAssign = async (projectId) => {
        if (!selectedStaff) return alert('Please select a staff member');
        try {
            await assignStaff({ projectId, staffId: selectedStaff }).unwrap();
            setAssigningId(null);
            setSelectedStaff('');
        } catch (err) {
            alert('Error assigning staff: ' + (err.data?.message || err.message));
        }
    };

    const handleClear = async (projectId, isVerification = false, details = {}) => {
        const { amount, paymentMode, referenceNumber } = details;
        if (isVerification) {
            try {
                await verifyPayment({ 
                    projectId, 
                    collectedAmount: amount,
                    paymentMode,
                    referenceNumber,
                    paymentNotes: 'Verified and approved by Accounts Manager.' 
                }).unwrap();
            } catch (err) {
                alert('Error verifying payment: ' + (err.data?.message || err.message));
            }
        } else {
            try {
                await verifyPayment({ 
                    projectId,
                    collectedAmount: amount,
                    paymentMode,
                    referenceNumber,
                    paymentNotes: 'Directly cleared and approved by Accounts Manager.'
                }).unwrap();
            } catch (err) {
                alert('Error clearing project: ' + (err.data?.message || err.message));
            }
        }
    };

    const filtered = projects.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.client?.name?.toLowerCase().includes(search.toLowerCase()));

    return {
        projects, staffList, loading, search, setSearch, assigningId, setAssigningId,
        selectedStaff, setSelectedStaff, filtered, handleAssign, handleClear
    };
};
