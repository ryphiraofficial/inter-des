import { useState } from 'react';

export const useProjectState = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showStageDropdown, setShowStageDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [groupBy, setGroupBy] = useState('none'); // 'none', 'priority', 'client', 'deadline'
    const [activeView, setActiveView] = useState('table'); // 'kanban', 'table', 'timeline', 'archive'

    return {
        projects, setProjects,
        loading, setLoading,
        searchTerm, setSearchTerm,
        stageFilter, setStageFilter,
        statusFilter, setStatusFilter,
        showStageDropdown, setShowStageDropdown,
        showStatusDropdown, setShowStatusDropdown,
        showGroupByDropdown, setShowGroupByDropdown,
        showModal, setShowModal,
        selectedProject, setSelectedProject,
        groupBy, setGroupBy,
        activeView, setActiveView
    };
};
