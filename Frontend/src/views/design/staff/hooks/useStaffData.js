import { useCallback } from 'react';
import {
    useGetDesignTasksQuery,
    useGetNotificationsQuery,
    useMarkNotificationReadMutation
} from '../../../../store/api/designApi';
import { useGetMaterialRequestsQuery } from '../../../../store/api/procurementApi';

export const useStaffData = (user) => {
    const { data: tasksRes, isLoading: tasksLoading, refetch: refetchTasks } = useGetDesignTasksQuery();
    const { data: notifRes, isLoading: notifLoading, refetch: refetchNotifs } = useGetNotificationsQuery({ limit: 10 });
    const { data: matRes, isLoading: matLoading, refetch: refetchMatReqs } = useGetMaterialRequestsQuery();

    const [markReadMutation] = useMarkNotificationReadMutation();

    const loading = tasksLoading || notifLoading || matLoading;

    const allTasks = tasksRes?.success ? tasksRes.data : [];
    // Only show tasks assigned to this staff member (optional, if backend doesn't filter)
    // The previous implementation used the full task list and didn't seem to filter by user here, 
    // but typically staff only see their tasks or derived lists.
    const tasks = allTasks;

    const notifications = notifRes?.success ? notifRes.data : [];
    
    // Filter material requests requested by this user
    const materialRequests = matRes?.success ? matRes.data.filter(r => (r.requestedBy?._id || r.requestedBy) === user?._id) : [];

    // Consolidated refetch
    const fetchData = useCallback(() => {
        refetchTasks();
        refetchNotifs();
        refetchMatReqs();
    }, [refetchTasks, refetchNotifs, refetchMatReqs]);

    // Derived task lists
    const pendingTasks = tasks.filter(t => ['To Do', 'In Progress', 'Revision Required'].includes(t.status));
    const revisionTasks = tasks.filter(t => t.status === 'Revision Required');
    const dueSoonTasks = tasks.filter(t => {
        if (t.status === 'Completed' || t.status === 'Approved') return false;
        if (!t.dueDate) return false;
        const diff = new Date(t.dueDate) - new Date();
        const days = diff / (1000 * 60 * 60 * 24);
        return days <= 3 && days >= 0;
    });

    const markNotifRead = async (id) => {
        try {
            await markReadMutation(id).unwrap();
        } catch (err) {
            console.error('Notif Read Error:', err);
        }
    };

    return {
        tasks, notifications, materialRequests, loading,
        pendingTasks, revisionTasks, dueSoonTasks,
        fetchData, markNotifRead
    };
};
