import { useState } from 'react';
import { 
    useGetEngineerProjectsQuery,
    useGetProjectReportsQuery,
    useGetSupervisorReportsQuery,
    useGetProjectAttendanceQuery,
    useGetProjectSafetyLogsQuery
} from '../../../../store/api/productionApi';

export const useEngineerReports = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedProject, setSelectedProject] = useState('all');
    
    // Fetch all projects for the engineer
    const { data: projectsRes, isLoading: loadingProjects } = useGetEngineerProjectsQuery();
    const projects = projectsRes?.success ? projectsRes.data : [];

    // Only fetch details if a specific project is selected, except when 'all' is selected (if API supports it, currently API expects projectId)
    // We will use skip: selectedProject === 'all' for endpoints that require a specific project ID.
    const shouldFetchDetails = selectedProject !== 'all';

    const { data: dailyRes, isLoading: loadingDaily } = useGetProjectReportsQuery(selectedProject, { skip: !shouldFetchDetails || activeTab !== 'daily' });
    const { data: supervisorRes, isLoading: loadingSupervisor } = useGetSupervisorReportsQuery(selectedProject, { skip: !shouldFetchDetails || activeTab !== 'supervisor' });
    const { data: attendanceRes, isLoading: loadingAttendance } = useGetProjectAttendanceQuery(selectedProject, { skip: !shouldFetchDetails || activeTab !== 'attendance' });
    const { data: safetyRes, isLoading: loadingSafety } = useGetProjectSafetyLogsQuery(selectedProject, { skip: !shouldFetchDetails || activeTab !== 'safety' });

    const dailyReports = dailyRes?.success ? dailyRes.data : [];
    const supervisorReports = supervisorRes?.success ? supervisorRes.data : [];
    const attendance = attendanceRes?.success ? attendanceRes.data : [];
    const safetyLogs = safetyRes?.success ? safetyRes.data : [];

    const loading = loadingProjects || loadingDaily || loadingSupervisor || loadingAttendance || loadingSafety;

    return {
        activeTab, setActiveTab,
        projects,
        selectedProject, setSelectedProject,
        dailyReports,
        supervisorReports,
        attendance,
        safetyLogs,
        loading
    };
};
