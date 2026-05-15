import { useState } from 'react';

export const useProjectState = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showStageDropdown, setShowStageDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    return {
        projects, setProjects,
        loading, setLoading,
        searchTerm, setSearchTerm,
        stageFilter, setStageFilter,
        statusFilter, setStatusFilter,
        showStageDropdown, setShowStageDropdown,
        showStatusDropdown, setShowStatusDropdown,
        showModal, setShowModal,
        selectedProject, setSelectedProject
    };
};
