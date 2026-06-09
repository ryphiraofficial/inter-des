import { useState, useEffect, useMemo } from 'react';
import {
    useGetHandoffProjectsQuery,
    useGetProductionStaffQuery,
    useAcceptHandoffMutation,
} from '../../../../store/api/productionApi';
import { useToast } from '../../../../models/context/ToastContext';

export const useProjectHandoff = () => {
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState({});
    const [assignments, setAssignments] = useState({});

    const { data: projectsData, isLoading: projectsLoading } = useGetHandoffProjectsQuery();
    const { data: staffData, isLoading: staffLoading } = useGetProductionStaffQuery();
    const [acceptHandoffMutation] = useAcceptHandoffMutation();

    const projects = useMemo(() => projectsData?.data ?? [], [projectsData]);
    const staff = staffData?.data ?? [];
    const loading = projectsLoading || staffLoading;

    // Initialise assignment slots whenever the project list updates
    useEffect(() => {
        setAssignments(prev => {
            const initial = {};
            let changed = false;
            projects.forEach(p => {
                if (!prev[p._id]) {
                    initial[p._id] = { projectEngineer: [], siteEngineer: [], siteSupervisor: [] };
                    changed = true;
                }
            });
            return changed ? { ...prev, ...initial } : prev;
        });
    }, [projects]);

    const handleAssign = (projectId, role, userIds) => {
        setAssignments(prev => ({
            ...prev,
            [projectId]: { ...prev[projectId], [role]: userIds }
        }));
    };

    const handleAcceptHandoff = async (project) => {
        const projectAssignments = assignments[project._id] ?? {};
        const noAssignments = (!projectAssignments.projectEngineer || projectAssignments.projectEngineer.length === 0) &&
            (!projectAssignments.siteEngineer || projectAssignments.siteEngineer.length === 0) &&
            (!projectAssignments.siteSupervisor || projectAssignments.siteSupervisor.length === 0);

        if (noAssignments) {
            const proceed = window.confirm("You haven't assigned any team members. Do you still want to activate this project?");
            if (!proceed) return;
        }

        try {
            setSubmitting(prev => ({ ...prev, [project._id]: true }));
            await acceptHandoffMutation({
                id: project._id,
                projectEngineer: projectAssignments.projectEngineer || [],
                siteEngineer: projectAssignments.siteEngineer || [],
                siteSupervisor: projectAssignments.siteSupervisor || [],
            }).unwrap();
            showToast('Project activated and team assigned successfully');
        } catch (err) {
            console.error('Accept handoff error:', err);
            showToast('Failed to accept handoff', 'error');
        } finally {
            setSubmitting(prev => ({ ...prev, [project._id]: false }));
        }
    };

    return {
        projects,
        loading,
        submitting,
        assignments,
        handleAssign,
        handleAcceptHandoff,
        projectEngineers: staff.filter(s => s.role === 'Project Engineer'),
        siteEngineers: staff.filter(s => s.role === 'Site Engineer'),
        siteSupervisors: staff.filter(s => s.role === 'Site Supervisor'),
    };
};
