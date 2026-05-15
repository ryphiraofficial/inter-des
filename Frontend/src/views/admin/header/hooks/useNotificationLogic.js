import { useCallback, useEffect, useRef } from 'react';
import { notificationAPI } from '../../../../models/api';

export const useNotificationLogic = ({ 
    setNotifications, setUnreadCount, showNotifications, setShowNotifications, notifications 
}) => {
    const pollRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await notificationAPI.getAll({ limit: 30 });
            if (res?.success) {
                setNotifications(res.data || []);
                setUnreadCount(res.unreadCount || 0);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [setNotifications, setUnreadCount]);

    useEffect(() => {
        fetchNotifications();
        pollRef.current = setInterval(fetchNotifications, 30000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error('Failed to mark as read:', err); }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) { console.error('Failed to mark all as read:', err); }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await notificationAPI.delete(id);
            const wasUnread = notifications.find(n => n._id === id && !n.isRead);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error('Failed to delete notification:', err); }
    };

    const toggleNotifications = () => {
        const willShow = !showNotifications;
        setShowNotifications(willShow);
        if (willShow) fetchNotifications();
    };

    return { handleMarkAsRead, handleMarkAllRead, handleDelete, toggleNotifications, fetchNotifications };
};
