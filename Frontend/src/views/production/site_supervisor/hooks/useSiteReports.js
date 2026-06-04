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
    });

    const { data: projectsRes } = useGetEngineerProjectsQuery();
    const projects = useMemo(() => projectsRes?.success ? projectsRes.data : [], [projectsRes]);

    const { data: reportsRes, isLoading: loadingReports } = useGetProjectReportsQuery(form.projectId, { skip: !form.projectId });
    const reports = reportsRes?.success ? reportsRes.data : [];

    const [submitDailyReport, { isLoading: submitting }] = useSubmitDailyReportMutation();

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
        loadingReports
    };
};
