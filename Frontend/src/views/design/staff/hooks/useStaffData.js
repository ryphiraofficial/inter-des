import { useState, useEffect, useCallback } from 'react';
import { taskAPI, notificationAPI, procurementAPI } from '../../../../models/api';

export const useStaffData = (user) => {
    const [tasks, setTasks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [materialRequests, setMaterialRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const [taskRes, notifRes, matRes] = await Promise.all([
                taskAPI.getAll(),
                notificationAPI.getAll({ limit: 10 }),
                procurementAPI.getMaterialRequests()
            ]);

            if (taskRes.success) setTasks(taskRes.data);
            if (notifRes.success) setNotifications(notifRes.data);
            if (matRes.success) {
                setMaterialRequests(matRes.data.filter(r =>
                    (r.requestedBy?._id || r.requestedBy) === user?._id
                ));
            }
        } catch (err) {
            console.error('Staff Dashboard Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchData(true);
        const interval = setInterval(() => fetchData(false), 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

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
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
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
