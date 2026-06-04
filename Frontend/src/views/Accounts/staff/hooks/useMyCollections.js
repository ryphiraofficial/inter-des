import { useState, useEffect } from 'react';
import { useGetPendingCollectionsQuery, useSubmitPaymentCollectionMutation } from '../../../../store/api/accountsApi';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/authSlice';

export const useMyCollections = (parentSearch, parentSetSearch) => {
    const user = useAppSelector(selectUser);
    const [projects, setProjects] = useState([]);
    
    const [localSearch, setLocalSearch] = useState('');
    const search = parentSearch !== undefined ? parentSearch : localSearch;
    const setSearch = parentSetSearch !== undefined ? parentSetSearch : setLocalSearch;
    const [collectingProject, setCollectingProject] = useState(null);
    
    // Modal Form State
    const [formData, setFormData] = useState({
        collectedAmount: '',
        paymentMode: 'Bank Transfer',
        referenceNumber: '',
        paymentNotes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const { data: res, isLoading: loading, refetch: fetchData } = useGetPendingCollectionsQuery();
    const [submitPaymentCollection] = useSubmitPaymentCollectionMutation();

    useEffect(() => {
        if (res?.success) {
            // Filter projects assigned to this logged in staff
            const assigned = (res.data || []).filter(p => {
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
            setProjects(assigned);
        }
    }, [res, user]);

    const handleOpenCollect = (project) => {
        const isBal = project.paymentStatus !== 'Pending Advance';
        const targetAmount = isBal ? (project.budget - (project.advanceAmount || project.collectedAmount || 0)) : (project.advanceAmount || 0);

        setCollectingProject(project);
        setFormData({
            collectedAmount: targetAmount || '',
            paymentMode: 'Bank Transfer',
            referenceNumber: '',
            paymentNotes: ''
        });
    };

    const handleSubmitCollection = async (e) => {
        e.preventDefault();
        if (!formData.collectedAmount || Number(formData.collectedAmount) <= 0) {
            return alert('Please enter a valid collected amount.');
        }

        try {
            setSubmitting(true);
            const response = await submitPaymentCollection({
                projectId: collectingProject._id,
                collectedAmount: Number(formData.collectedAmount),
                paymentMode: formData.paymentMode,
                referenceNumber: formData.referenceNumber,
                paymentNotes: formData.paymentNotes
            }).unwrap();

            if (response?.success) {
                alert('Payment collection details submitted successfully! Assigned Accounts Manager will verify it shortly.');
                setCollectingProject(null);
                fetchData();
            } else {
                alert(response?.message || 'Error recording payment.');
            }
        } catch (err) {
            alert('Failed to submit: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const pendingCollections = projects.filter(p => p.paymentCollectionStatus === 'Assigned');
    const collectedCollections = projects.filter(p => p.paymentCollectionStatus === 'Collected');
    const totalPendingAmount = pendingCollections.reduce((acc, p) => {
        const isBal = p.paymentStatus !== 'Pending Advance';
        const target = isBal ? (p.budget - (p.advanceAmount || p.collectedAmount || 0)) : (p.advanceAmount || 0);
        return acc + target;
    }, 0);

    const filtered = projects.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) || 
        p.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.projectNumber?.toLowerCase().includes(search.toLowerCase())
    );

    return {
        search,
        setSearch,
        projects,
        loading,
        fetchData,
        collectingProject,
        setCollectingProject,
        formData,
        setFormData,
        submitting,
        handleOpenCollect,
        handleSubmitCollection,
        pendingCollections,
        collectedCollections,
        totalPendingAmount,
        filtered
    };
};
