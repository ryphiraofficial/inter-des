import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useGetEngineerProjectsQuery, useGetProjectReportsQuery, useSubmitDailyReportMutation } from '../../../../store/api/productionApi';

export const useSiteReports = () => {
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        projectId: '',
        reportDate: format(new Date(), 'yyyy-MM-dd'),
        workStatus: 'On Track',
        weather: 'Clear',
        workDone: '',
        issues: '',
        nextDayPlan: '',
        workersPresent: '',
        sendToRole: 'Project Manager',
        sendToUser: '',
    });

    const { data: projectsRes } = useGetEngineerProjectsQuery();
    const projects = useMemo(() => projectsRes?.success ? projectsRes.data : [], [projectsRes]);

    const { data: reportsRes, isLoading: loadingReports } = useGetProjectReportsQuery(form.projectId, { skip: !form.projectId });
    const reports = reportsRes?.success ? reportsRes.data : [];

    const [submitDailyReport, { isLoading: submitting }] = useSubmitDailyReportMutation();

    const selectedProject = useMemo(() => projects.find(p => p._id === form.projectId) || null, [projects, form.projectId]);

    const roleUsers = useMemo(() => {
        if (!selectedProject || !form.sendToRole) return [];
        
        let users = [];
        if (form.sendToRole === 'Project Manager') {
            if (selectedProject.projectManager) users = [selectedProject.projectManager];
        } else if (form.sendToRole === 'Project Engineer') {
            users = selectedProject.projectEngineer || [];
        } else if (form.sendToRole === 'Site Engineer') {
            users = selectedProject.siteEngineer || [];
        }
        return users;
    }, [selectedProject, form.sendToRole]);

    useEffect(() => {
        if (roleUsers.length > 0 && !roleUsers.find(u => u._id === form.sendToUser)) {
            setForm(f => ({ ...f, sendToUser: roleUsers[0]._id }));
        } else if (roleUsers.length === 0 && form.sendToUser) {
            setForm(f => ({ ...f, sendToUser: '' }));
        }
    }, [roleUsers, form.sendToUser]);

    useEffect(() => {
        let timer;
        if (submitted) {
            timer = setTimeout(() => setSubmitted(false), 4000);
        }
        return () => clearTimeout(timer);
    }, [submitted]);

    useEffect(() => {
        if (projects.length > 0 && !form.projectId) {
            setForm(f => ({ ...f, projectId: projects[0]._id }));
        }
    }, [projects, form.projectId]);

    const handleProjectChange = (projectId) => {
        setForm(f => ({ ...f, projectId }));
        setErrors(er => ({ ...er, projectId: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.projectId) e.projectId = 'Select a project';
        if (!form.workDone.trim()) e.workDone = 'Describe today\'s work';
        return e;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        
        try {
            await submitDailyReport(form).unwrap();
            setForm(prev => ({ 
                ...prev,
                reportDate: format(new Date(), 'yyyy-MM-dd'), 
                workStatus: 'On Track', 
                weather: 'Clear', 
                workDone: '', 
                issues: '', 
                nextDayPlan: '', 
                workersPresent: '' 
            }));
            setErrors({});
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit report', error);
        }
    };

    return {
        projects,
        reports,
        submitting,
        submitted,
        errors, setErrors,
        form, setForm,
        handleProjectChange,
        handleSubmit,
        loadingReports,
        roleUsers
    };
};
