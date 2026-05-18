import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    RefreshCw, Landmark, LayoutDashboard, CheckCircle,
    FileText, CreditCard, TrendingUp, Users, ShoppingBag,
    Briefcase, PieChart, Bell
} from 'lucide-react';
import { useNotificationLogic } from '../../admin/header/hooks/useNotificationLogic';
import NotificationPopup from '../../admin/header/components/NotificationPopup';
import '../../admin/css/Header.css';

const TAB_META = {
    overview: { label: 'Overview', icon: LayoutDashboard },
    clearance: { label: 'Payment Clearance Hub', icon: CheckCircle },
    invoices: { label: 'Invoices', icon: FileText },
    payments: { label: 'Payments', icon: CreditCard },
    expenses: { label: 'Expenses', icon: TrendingUp },
    clients: { label: 'Clients', icon: Users },
    vendors: { label: 'Vendors', icon: ShoppingBag },
    projects: { label: 'Projects', icon: Briefcase },
    reports: { label: 'Financial Reports', icon: PieChart }
};

const AccountsNavbar = ({ user, onRefresh, isLoading }) => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'A';

    const currentTab = TAB_META[activeTab] || { label: 'Overview', icon: LayoutDashboard };
    const IconComponent = currentTab.icon;

    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const wrapperRef = useRef(null);
    const popupRef = useRef(null);

    const notificationLogic = useNotificationLogic({
        setNotifications,
        setUnreadCount,
        showNotifications,
        setShowNotifications,
        notifications
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showNotifications]);

    return (
        <header className="accounts-navbar" style={{ overflow: 'visible' }}>
            <div className="accounts-navbar-brand">
                <div className="accounts-navbar-icon">
                    <IconComponent size={20} />
                </div>
                <div>
                    <span className="accounts-navbar-title">{currentTab.label}</span>
                </div>
            </div>

            <div className="accounts-navbar-right" style={{ overflow: 'visible' }}>
                {onRefresh && (
                    <button className="accounts-navbar-refresh" onClick={onRefresh} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
                        <span>{isLoading ? 'Updating...' : 'Refresh'}</span>
                    </button>
                )}
                
                {/* Notification bell */}
                <div className="header-notification-wrapper" ref={wrapperRef} style={{ marginRight: '8px', position: 'relative' }}>
                    <button
                        className={`header-notification-btn ${showNotifications ? 'active' : ''}`}
                        onClick={notificationLogic.toggleNotifications}
                        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                    >
                        <Bell size={19} strokeWidth={2.2} />
                        {unreadCount > 0 && (
                            <span className="header-notification-badge" style={{ top: '-2px', right: '-2px' }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    <NotificationPopup 
                        showNotifications={showNotifications}
                        notifications={notifications}
                        unreadCount={unreadCount}
                        handleMarkAsRead={notificationLogic.handleMarkAsRead}
                        handleMarkAllRead={notificationLogic.handleMarkAllRead}
                        handleDelete={notificationLogic.handleDelete}
                        setShowNotifications={setShowNotifications}
                        popupRef={popupRef}
                    />
                </div>

                <div className="accounts-navbar-user">
                    <div className="accounts-navbar-avatar" title={user?.name || 'Accounts User'}>
                        {getInitials(user?.name)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AccountsNavbar;
