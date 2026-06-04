import { useState, useEffect } from 'react';
import { 
    useGetProductionPipelineQuery, 
    useGetReplacementRequestsQuery, 
    useActionReplacementRequestMutation 
} from '../../../../store/api/productionApi';
import { useGetApprovalsQuery, useCreateApprovalMutation, useUpdateApprovalMutation } from '../../../../store/api/sharedApi';

export const useApprovals = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    
    const [newRequest, setNewRequest] = useState({
        requestTitle: '', projectName: '', submittedBy: '', requestType: 'Material', value: ''
    });

    const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);

    // Replacement requests handled via RTK Query
    const { data: staffRes, isLoading: loadingStaff, refetch: fetchStaffRequests } = useGetReplacementRequestsQuery();
    const [actionReplacementRequest] = useActionReplacementRequestMutation();
    
    const staffRequests = staffRes?.success ? staffRes.data : [];

    const [createApproval] = useCreateApprovalMutation();
    const [updateApproval] = useUpdateApprovalMutation();

    const { data: genRes, isLoading: localLoading } = useGetApprovalsQuery();
    const approvals = genRes?.success ? genRes.data : [];

    useEffect(() => {
        const handleOpenModal = () => setIsModalOpen(true);
        window.addEventListener('open-create-approval-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-approval-modal', handleOpenModal);
    }, []);

    const filteredApprovals = (activeTab === 'general' ? approvals : staffRequests).filter(item => {
        if (filterStatus === 'all') return true;
        return item.status.toLowerCase() === filterStatus.toLowerCase();
    });

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = { ...newRequest, value: newRequest.value ? Number(newRequest.value) : 0 };
            await createApproval(dataToSubmit).unwrap();
            setIsModalOpen(false);
            setNewRequest({ requestTitle: '', projectName: '', submittedBy: '', requestType: 'Material', value: '' });
        } catch (err) {
            alert("Error creating request: " + err.message);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await updateApproval({ id, status: newStatus }).unwrap();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const handleActionStaffRequest = async (id, status) => {
        const remarks = prompt("Enter remarks (optional):");
        try {
            await actionReplacementRequest({ requestId: id, status, adminRemarks: remarks }).unwrap();
            fetchStaffRequests();
        } catch (err) {
            alert("Error: " + (err.data?.message || err.message));
        }
    };

    return {
        activeTab, setActiveTab,
        loading: loadingStaff || localLoading, 
        error: null,
        filterStatus, setFilterStatus,
        isModalOpen, setIsModalOpen,
        filtersOpen, setFiltersOpen,
        expandedRow, toggleRow, setExpandedRow,
        newRequest, setNewRequest,
        filteredApprovals,
        handleCreateRequest,
        handleUpdateStatus,
        handleActionStaffRequest
    };
};
