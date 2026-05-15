import { useEffect } from 'react';
import { projectAPI } from '../../../../models/api';

export const useProjectData = ({ 
    setProjects, setLoading, setSelectedProject, stageFilter, statusFilter, urlProjectId 
}) => {
    
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const params = {};
            if (stageFilter) params.stage = stageFilter;
            if (statusFilter) params.status = statusFilter;
            
            const res = await projectAPI.getAll(params);
            if (res.success) setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSingleProject = async (id) => {
        try {
            const res = await projectAPI.getById(id);
            if (res.success) setSelectedProject(res.data);
        } catch (err) {
            console.error('Error fetching project details:', err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [stageFilter, statusFilter]);

    useEffect(() => {
        if (urlProjectId) fetchSingleProject(urlProjectId);
    }, [urlProjectId]);

    return { fetchProjects, fetchSingleProject };
};
