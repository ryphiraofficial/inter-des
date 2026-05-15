import { useState } from 'react';

export const useHeaderState = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    return {
        showNotifications, setShowNotifications,
        notifications, setNotifications,
        unreadCount, setUnreadCount,
        searchValue, setSearchValue,
        searchOpen, setSearchOpen
    };
};
