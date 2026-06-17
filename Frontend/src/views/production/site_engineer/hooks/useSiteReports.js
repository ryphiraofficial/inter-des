import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { useGetEngineerProjectsQuery, useGetProjectReportsQuery, useSubmitDailyReportMutation } from '../../../../store/api/productionApi';
import { useUploadImageMutation } from '../../../../store/api/sharedApi';
import { useToast } from '../../../../models/context/ToastContext';

export const useSiteReports = () => {
    const { showToast } = useToast();
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [uploadingFile, setUploadingFile] = useState(false);
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
        attachments: []
    });

    const [uploadImageMutation] = useUploadImageMutation();

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
        e.preventDefault();
        const errs = {};
        if (!form.projectId) errs.projectId = 'Project is required';
        if (!form.workDone) errs.workDone = 'Work done is required';
        if (!form.sendToUser) errs.sendToUser = 'Recipient is required';
        
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            await submitDailyReport(form).unwrap();
            setSubmitted(true);
            setForm({
                ...form,
                workDone: '',
                issues: '',
                nextDayPlan: '',
                attachments: []
            });
            setErrors({});
            showToast('success', 'Report submitted successfully!');
        } catch (error) {
            console.error('Submit error:', error);
            showToast('error', error.data?.message || 'Failed to submit report');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await uploadImageMutation(formData).unwrap();
            if (res.success && res.url) {
                let resourceType = 'raw';
                if (file.type.startsWith('image/')) resourceType = 'image';
                else if (file.type.startsWith('video/')) resourceType = 'video';

                setForm(f => ({
                    ...f,
                    attachments: [...f.attachments, {
                        url: res.url,
                        originalName: file.name,
                        resourceType
                    }]
                }));
                showToast('success', 'File uploaded successfully!');
            }
        } catch (err) {
            console.error('Upload error:', err);
            showToast('error', 'Failed to upload file');
        } finally {
            setUploadingFile(false);
            e.target.value = ''; // reset input
        }
    };

    const removeAttachment = (index) => {
        setForm(f => ({
            ...f,
            attachments: f.attachments.filter((_, i) => i !== index)
        }));
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
        roleUsers,
        uploadingFile,
        handleFileUpload,
        removeAttachment,
        loadingReports
    };
};
