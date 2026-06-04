import { useEffect } from 'react';
import {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation
} from '../../../../store/api/adminApi';

export const useNotificationLogic = ({ 
    setNotifications, setUnreadCount, showNotifications, setShowNotifications 
}) => {
    
    // We can use pollingInterval from RTK Query directly instead of setInterval!
    const { data: notifRes, refetch } = useGetNotificationsQuery(
        { limit: 30 },
        { pollingInterval: 30000 } // Poll every 30 seconds
    );

    const [markRead] = useMarkNotificationReadMutation();
    const [markAllRead] = useMarkAllNotificationsReadMutation();
    const [deleteNotif] = useDeleteNotificationMutation();

    useEffect(() => {
        if (notifRes?.success) {
            setNotifications(notifRes.data || []);
            setUnreadCount(notifRes.unreadCount || 0);
        }
    }, [notifRes, setNotifications, setUnreadCount]);

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await markRead(id).unwrap();
        } catch (err) { 
            console.error('Failed to mark as read:', err); 
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllRead().unwrap();
        } catch (err) { 
            console.error('Failed to mark all as read:', err); 
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation();
        try {
            await deleteNotif(id).unwrap();
        } catch (err) { 
            console.error('Failed to delete notification:', err); 
        }
    };

    const toggleNotifications = () => {
        const willShow = !showNotifications;
        setShowNotifications(willShow);
        if (willShow) refetch();
    };

    return { handleMarkAsRead, handleMarkAllRead, handleDelete, toggleNotifications, fetchNotifications: refetch };
};
