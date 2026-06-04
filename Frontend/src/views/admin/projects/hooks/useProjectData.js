import { useEffect } from 'react';
import { useGetProjectsQuery, useGetProjectByIdQuery } from '../../../../store/api/adminApi';

export const useProjectData = ({ 
    setProjects, setLoading, setSelectedProject, stageFilter, statusFilter, urlProjectId, setSearchTerm 
}) => {
    
    useEffect(() => {
        const handleHeaderSearch = (e) => setSearchTerm(e.detail || '');
        window.addEventListener('header-search', handleHeaderSearch);
        return () => window.removeEventListener('header-search', handleHeaderSearch);
    }, [setSearchTerm]);
    
    const params = {};
    if (stageFilter) params.stage = stageFilter;
    if (statusFilter) params.status = statusFilter;
    
    const { data: projectsRes, isLoading, refetch } = useGetProjectsQuery(params);
    const { data: singleProjRes } = useGetProjectByIdQuery(urlProjectId, { skip: !urlProjectId });

    useEffect(() => {
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    useEffect(() => {
        if (projectsRes?.success) setProjects(projectsRes.data);
    }, [projectsRes, setProjects]);

    useEffect(() => {
        if (singleProjRes?.success) setSelectedProject(singleProjRes.data);
    }, [singleProjRes, setSelectedProject]);

    return { fetchProjects: refetch, fetchSingleProject: () => {} };
};
