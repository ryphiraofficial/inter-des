import { useState, useEffect, useMemo } from 'react';
import { useGetAccountsProjectsQuery } from '../../../store/api/accountsApi';

export const useAccountsProjectLogic = (urlProjectId) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeView, setActiveView] = useState('table');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { data: projectRes, isLoading: loading } = useGetAccountsProjectsQuery();
    
    const projects = useMemo(() => projectRes?.success ? projectRes.data : [], [projectRes]);

    useEffect(() => {
        if (urlProjectId && projects.length > 0) {
            const found = projects.find(p => p._id === urlProjectId);
            if (found) setSelectedProject(found);
        }
    }, [urlProjectId, projects]);

    useEffect(() => {
        const handleOpenModal = () => setShowModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('open-create-project-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);
        return () => {
            window.removeEventListener('open-create-project-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, []);

    const filtered = projects.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.projectNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
        projects, loading, searchTerm, setSearchTerm, stageFilter, setStageFilter,
        statusFilter, setStatusFilter, activeView, setActiveView,
        selectedProject, setSelectedProject, showModal, setShowModal, filtered
    };
};
