import { useState, useRef, useEffect } from 'react';
import { useGetPMProjectsQuery as useGetProjectsQuery } from '../../../../store/api/productionApi';

export const useProjectsList = (isCompletedView = false) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [expandedRows, setExpandedRows] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // Build query args — RTK Query will re-fetch when these change (debounced below)
    const [queryArgs, setQueryArgs] = useState({});

    // Debounce search/filter changes before hitting the API
    useEffect(() => {
        const id = setTimeout(() => {
            setQueryArgs({
                status: filterStatus !== 'All' ? filterStatus : undefined,
                search: searchTerm || undefined,
            });
        }, 300);
        return () => clearTimeout(id);
    }, [searchTerm, filterStatus]);

    const { data, isFetching: loading, refetch: fetchProjects } = useGetProjectsQuery(queryArgs);
    const projects = data?.success ? data.data : [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const displayProjects = projects
        .filter(project => {
            const isFinished = project.status === 'Completed' || Number(project.progress) >= 100;
            return isCompletedView ? isFinished : !isFinished;
        })
        .sort((a, b) => {
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

    return {
        searchTerm, setSearchTerm,
        filterStatus, setFilterStatus,
        projects,
        loading,
        filtersOpen, setFiltersOpen,
        expandedRows, toggleRow,
        activeDropdown, setActiveDropdown,
        dropdownRef,
        displayProjects,
        fetchProjects,
    };
};
