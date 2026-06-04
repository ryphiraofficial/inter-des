import { useState, useEffect } from 'react';
import { 
    useGetPMTeamOverviewQuery as useGetTeamMembersQuery,
    useCreatePMTeamMemberMutation,
    useDeletePMTeamMemberMutation
} from '../../../../store/api/productionApi';

export const useTeamOverview = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, memberId: null });
    const [newMember, setNewMember] = useState({
        name: '', role: '', email: '', phone: '', location: '',
        reportingManager: '', activeProjects: 0, workloadPercentage: 0, performance: 'Good'
    });

    // RTK Query — cached, auto-refetches after mutations via tag invalidation
    const { data, isLoading: loading, error: rawError, refetch: fetchTeam } = useGetTeamMembersQuery();
    const teamData = data?.success ? data.data : [];
    const error = rawError?.message ?? null;

    const filteredTeam = teamData.filter(member =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const openModal = () => setIsModalOpen(true);
        window.addEventListener('open-create-production-member-modal', openModal);
        return () => window.removeEventListener('open-create-production-member-modal', openModal);
    }, []);

    useEffect(() => {
        const handleSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleSearch);
        return () => window.removeEventListener('header-search', handleSearch);
    }, []);

    const [createPMTeamMember] = useCreatePMTeamMemberMutation();
    const [deletePMTeamMember] = useDeletePMTeamMemberMutation();

    const handleCreateMember = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...newMember,
                reportingManager: newMember.reportingManager
                    ? newMember.reportingManager.split(',').map(m => m.trim()).filter(Boolean)
                    : []
            };
            await createPMTeamMember(dataToSubmit).unwrap();
            setIsModalOpen(false);
            setNewMember({ name: '', role: '', email: '', phone: '', location: '', reportingManager: '', activeProjects: 0, workloadPercentage: 0, performance: 'Good' });
        } catch (err) {
            alert('Error creating member: ' + (err.data?.message || err.message));
        }
    };

    // Open the custom confirm dialog instead of window.confirm
    const handleDeleteMember = (e, id) => {
        e.stopPropagation();
        setConfirmDialog({ isOpen: true, memberId: id });
    };

    // Called when user clicks "Delete" in the dialog
    const handleConfirmDelete = async () => {
        const id = confirmDialog.memberId;
        setConfirmDialog({ isOpen: false, memberId: null });
        try {
            await deletePMTeamMember(id).unwrap();
        } catch (err) {
            alert('Error deleting member: ' + (err.data?.message || err.message));
        }
    };

    // Called when user clicks "Cancel"
    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, memberId: null });
    };

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return {
        teamData, filteredTeam,
        loading, error,
        isModalOpen, setIsModalOpen,
        newMember, setNewMember,
        handleCreateMember, handleDeleteMember,
        handleConfirmDelete, handleCancelDelete,
        confirmDialog,
        expandedRow, toggleRow,
    };
};
