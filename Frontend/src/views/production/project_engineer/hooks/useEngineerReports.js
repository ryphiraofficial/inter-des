import { useState } from 'react';
import { 
    useGetEngineerProjectsQuery,
    useGetProjectReportsQuery,
    useGetSupervisorReportsQuery,
    useGetProjectAttendanceQuery,
    useGetProjectSafetyLogsQuery
} from '../../../../store/api/productionApi';

export const useEngineerReports = () => {
    const [activeTab, setActiveTab] = useState('site_supervisor');
    const [selectedProject, setSelectedProject] = useState('all');
    
    // Fetch all projects for the engineer
    const { data: projectsRes, isLoading: loadingProjects } = useGetEngineerProjectsQuery();
    const projects = projectsRes?.success ? projectsRes.data : [];

    const { data: dailyRes, isLoading: loadingDaily } = useGetProjectReportsQuery(selectedProject);

    const dailyReports = dailyRes?.success ? dailyRes.data : [];

    const loading = loadingProjects || loadingDaily;

    return {
        activeTab, setActiveTab,
        projects,
        selectedProject, setSelectedProject,
        dailyReports,
        loading
    };
};
