import { useState, useEffect } from 'react';
import { useGetTasksQuery, useUpdateProjectMutation } from '../../../../store/api/adminApi';

export const useProjectDetail = (selectedProject, onUpdate) => {
    const [popover, setPopover] = useState(null); // { type, manager, staff, loading }
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [deadlineValue, setDeadlineValue] = useState('');
    const [isSavingDeadline, setIsSavingDeadline] = useState(false);

    const [updateProject] = useUpdateProjectMutation();
    const { data: tasksRes, isLoading: tasksLoading } = useGetTasksQuery(
        { project: selectedProject?._id },
        { skip: !selectedProject?._id }
    );
    const allTasks = tasksRes?.success ? tasksRes.data : [];

    useEffect(() => {
        if (selectedProject) {
            setDeadlineValue(selectedProject.targetEndDate ? new Date(selectedProject.targetEndDate).toISOString().split('T')[0] : '');
            setIsEditingDeadline(false);
        }
    }, [selectedProject]);

    const handleSaveDeadline = async () => {
        if (!deadlineValue) {
            setIsEditingDeadline(false);
            return;
        }
        setIsSavingDeadline(true);
        try {
            await updateProject({ id: selectedProject._id, targetEndDate: deadlineValue }).unwrap();
            selectedProject.targetEndDate = deadlineValue; // Optimistic update
            if (onUpdate) onUpdate();
            setIsEditingDeadline(false);
        } catch (err) {
            console.error('Failed to update deadline:', err);
            alert('Failed to update deadline');
        } finally {
            setIsSavingDeadline(false);
        }
    };

    const handleManagerClick = (type, manager) => {
        // Filter tasks related to this stage/manager to find staff
        const relatedTasks = allTasks.filter(t => {
            const searchType = type.toLowerCase();
            return (
                t.status?.toLowerCase().includes(searchType) || 
                t.title?.toLowerCase().includes(searchType) ||
                t.tags?.some(tag => tag.toLowerCase().includes(searchType))
            );
        });

        // Get unique staff from these tasks
        const staffMap = new Map();
        relatedTasks.forEach(t => {
            t.assignedTo?.forEach(s => {
                if (s && s._id) staffMap.set(s._id, s);
            });
        });

        setPopover({
            type,
            manager,
            staff: Array.from(staffMap.values()),
            loading: false
        });
    };

    return {
        popover,
        setPopover,
        isEditingDeadline,
        setIsEditingDeadline,
        deadlineValue,
        setDeadlineValue,
        isSavingDeadline,
        handleSaveDeadline,
        handleManagerClick
    };
};
