import { useState, useEffect } from 'react';
import { projectAPI } from '../../../models/api';

export const useAccountsProjectLogic = (urlProjectId) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeView, setActiveView] = useState('table');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectAPI.getAll();
            if (response.success) {
                setProjects(response.data || []);
                if (urlProjectId) {
                    const found = response.data.find(p => p._id === urlProjectId);
                    if (found) setSelectedProject(found);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
        const handleOpenModal = () => setShowModal(true);
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('open-create-project-modal', handleOpenModal);
        window.addEventListener('header-search', handleHeaderSearch);
        return () => {
            window.removeEventListener('open-create-project-modal', handleOpenModal);
            window.removeEventListener('header-search', handleHeaderSearch);
        };
    }, [urlProjectId]);

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
