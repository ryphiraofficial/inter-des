import { useState, useEffect } from 'react';
import {
    useGetPMTasksQuery as useGetAllTasksQuery,
    useGetPMProjectsQuery as useGetProjectsQuery,
    useGetPMTeamOverviewQuery as useGetProductionStaffQuery,
    useCreatePMTaskMutation as useCreateTaskMutation,
    useUpdatePMTaskStatusMutation as useUpdateTaskStatusMutation,
} from '../../../../store/api/productionApi';

// ─────────────────────────────────────────────────────────────────────────────
// Kanban tasks are derived directly from the RTK Query cache.
// onDragEnd fires the mutation with no local state juggling — the optimistic
// update in productionApi.updateTaskStatus patches the cache instantly, so the
// card visually moves before the network round-trip completes.
// If the API fails, RTK Query automatically reverts the patch.
// ─────────────────────────────────────────────────────────────────────────────
export const useTasksBoard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterPriority, setFilterPriority] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTask, setNewTask] = useState({
        title: '', description: '', projectId: '',
        assignedTo: '', stage: 'PE', priority: 'Medium', dueDate: ''
    });

    const { data: tasksData, isLoading: loading, error: tasksError } = useGetAllTasksQuery();
    const { data: projectsData } = useGetProjectsQuery({ status: 'Active' });
    const { data: staffData } = useGetProductionStaffQuery();

    const [createTaskMutation] = useCreateTaskMutation();
    const [updateTaskStatusMutation] = useUpdateTaskStatusMutation();

    // Build kanban columns from cached (and optimistically-patched) task list
    const rawTasks = tasksData?.success ? tasksData.data : [];
    const tasks = rawTasks.reduce(
        (acc, task) => {
            const col = task.status || 'Pending';
            if (acc[col]) acc[col].push(task);
            else acc['Pending'].push(task);
            return acc;
        },
        { 'Pending': [], 'In Progress': [], 'Completed': [], 'Approved': [] }
    );

    const projects = projectsData?.success ? projectsData.data : [];
    const staff = staffData?.success ? staffData.data : [];
    const error = tasksError?.message ?? null;

    // Global event — fired by dashboard header action buttons
    useEffect(() => {
        const openModal = () => setIsModalOpen(true);
        window.addEventListener('open-create-production-task-modal', openModal);
        return () => window.removeEventListener('open-create-production-task-modal', openModal);
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await createTaskMutation(newTask).unwrap();
            if (res.success) {
                setIsModalOpen(false);
                setNewTask({ title: '', description: '', projectId: '', assignedTo: '', stage: 'PE', priority: 'Medium', dueDate: '' });
            }
        } catch (err) {
            console.error('Error creating task', err);
        }
    };

    // Drag-and-drop — optimistic update fires in productionApi endpoint.
    // No local state manipulation needed; the cache patch is handled by RTK Query.
    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        try {
            await updateTaskStatusMutation({
                taskId: draggableId,
                status: destination.droppableId,
            }).unwrap();
        } catch (err) {
            // Patch was already undone by RTK Query — just log
            console.error('Task status update failed, reverting:', err);
        }
    };

    const filterTask = (task) => {
        if (filterPriority !== 'All' && task.priority !== filterPriority) return false;
        const searchTarget = searchTerm.toLowerCase();
        if (searchTerm &&
            !task.title.toLowerCase().includes(searchTarget) &&
            !(task.projectId?.projectName?.toLowerCase().includes(searchTarget))) {
            return false;
        }
        return true;
    };

    return {
        tasks, projects, staff,
        loading, error,
        isModalOpen, setIsModalOpen,
        filtersOpen, setFiltersOpen,
        filterPriority, setFilterPriority,
        searchTerm, setSearchTerm,
        newTask, setNewTask,
        handleCreateTask,
        onDragEnd,
        filterTask,
    };
};
