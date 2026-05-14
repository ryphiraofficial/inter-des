import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationAPI } from '../../../models/api';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const pollRef = useRef(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationAPI.getAll();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (_) {}
    }, []);

    useEffect(() => {
        fetchNotifications();
        pollRef.current = setInterval(fetchNotifications, 30000);
        return () => clearInterval(pollRef.current);
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await notificationAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (_) {}
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (_) {}
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await notificationAPI.delete(id);
            const wasUnread = notifications.find(n => n._id === id && !n.isRead);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (_) {}
    };

    return {
        notifications,
        unreadCount,
        fetchNotifications,
        handleMarkAsRead,
        handleMarkAllRead,
        handleDelete
    };
};
