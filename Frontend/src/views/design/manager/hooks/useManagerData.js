import { useState, useEffect, useCallback } from 'react';
import {
    projectAPI, quotationAPI, taskAPI, notificationAPI,
    staffAPI, procurementAPI, BASE_IMAGE_URL
} from '../../../../models/api';

export const useManagerData = () => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [teamStats, setTeamStats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [materialRequests, setMaterialRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = useCallback((url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${BASE_IMAGE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [projectStats, projectList, taskList, quoteRes, teamRes, notifRes, staffRes, matRes] = await Promise.all([
                projectAPI.getStats(),
                projectAPI.getAll({ limit: 100 }),
                taskAPI.getAll({ limit: 100 }),
                quotationAPI.getAll({ status: 'Approved' }),
                staffAPI.getAnalyticsOverview(),
                notificationAPI.getAll({ limit: 30 }),
                staffAPI.getAll(),
                procurementAPI.getMaterialRequests({ limit: 100 })
            ]);

            if (projectStats.success) setStats(projectStats.data);
            if (projectList.success) setProjects(projectList.data);
            if (taskList.success) setTasks(taskList.data);
            if (quoteRes.success) setQuotations(quoteRes.data);
            if (teamRes.success) setTeamStats(teamRes.data.filter(s => s.role?.toLowerCase().includes('design')));
            if (notifRes.success) setNotifications(notifRes.data);
            if (staffRes.success) setStaffList(staffRes.data.filter(s => s.role?.toLowerCase().includes('design') && s.status === 'Active'));
            if (matRes.success) setMaterialRequests(matRes.data);
        } catch (err) {
            console.error('Design Manager Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    return {
        stats, projects, tasks, quotations, teamStats,
        notifications, staffList, materialRequests, loading,
        fetchData, getImageUrl
    };
};
