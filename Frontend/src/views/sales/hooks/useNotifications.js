import { useEffect } from 'react';
import {
    useGetSalesNotificationsQuery,
    useMarkSalesNotificationReadMutation,
    useMarkAllSalesNotificationsReadMutation,
    useDeleteSalesNotificationMutation
} from '../../../store/api/salesApi';

export const useNotifications = () => {
    const { data: notifRes, refetch } = useGetSalesNotificationsQuery(
        { limit: 30 },
        { pollingInterval: 30000 }
    );

    const [markRead] = useMarkSalesNotificationReadMutation();
    const [markAllRead] = useMarkAllSalesNotificationsReadMutation();
    const [deleteNotif] = useDeleteSalesNotificationMutation();

    const notifications = notifRes?.success ? notifRes.data : [];
    const unreadCount = notifRes?.unreadCount || notifications.filter(n => !n.isRead).length;

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await markRead(id).unwrap();
        } catch (_) {}
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllRead().unwrap();
        } catch (_) {}
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await deleteNotif(id).unwrap();
        } catch (_) {}
    };

    return {
        notifications,
        unreadCount,
        fetchNotifications: refetch,
        handleMarkAsRead,
        handleMarkAllRead,
        handleDelete
    };
};
